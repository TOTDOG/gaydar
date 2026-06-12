import os
import torch
import psycopg2
from torch.optim import AdamW
from torch.optim.lr_scheduler import ReduceLROnPlateau
from dotenv import load_dotenv
from pathlib import Path
from huggingface_hub import HfApi

load_dotenv('.env.local')

from model import ModularTransformer, DEVICE
from dataset import CombinedDataset
from losses import combined_loss


def fetch_data():
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute('''
        SELECT id, name, type, active, classes, min, max, description
        FROM "Parameter"
        WHERE active = true
    ''')
    cols = [d[0] for d in cur.description]
    parameters = [dict(zip(cols, row)) for row in cur.fetchall()]

    cur.execute('SELECT "setParameters0", "setParameters1", relate FROM "Comparison"')
    comparisons = [
        {'setParameters0': r[0], 'setParameters1': r[1], 'relate': r[2]}
        for r in cur.fetchall()
    ]

    cur.execute('SELECT "setParameters", rank FROM "Rank"')
    ranks = [
        {'setParameters': r[0], 'rank': r[1]}
        for r in cur.fetchall()
    ]

    cur.close()
    conn.close()
    return parameters, comparisons, ranks


def upload_weights():
    api = HfApi()
    repo_id = os.environ['HF_REPO_ID']
    token = os.environ['HF_TOKEN']
    base = Path('/kaggle/working') if os.path.exists('/kaggle/working') else Path('.')

    # Upload main model
    api.upload_file(
        path_or_fileobj=str(base / 'model.pt'),
        path_in_repo='model.pt',
        repo_id=repo_id,
        repo_type='model',
        token=token
    )

    # Upload all encoder weights
    encoder_dir = base / 'encoder_weights'
    for path in encoder_dir.glob('*.pt'):
        api.upload_file(
            path_or_fileobj=str(path),
            path_in_repo=f'encoder_weights/{path.name}',
            repo_id=repo_id,
            repo_type='model',
            token=token
        )

    print(f"Uploaded weights to {repo_id}")


def train(model: ModularTransformer,
          parameters: list[dict],
          comparison_records: list[dict],
          rank_records: list[dict],
          epochs: int = 50,
          lr: float = 1e-3,
          batch_size: int = 16,
          grad_clip: float = 1.0):

    print(f"Training on {DEVICE}")
    model.registry.register_all(parameters)

    dataset = CombinedDataset(parameters, comparison_records, rank_records)
    loader = dataset.make_loader(batch_size)

    optimizer = AdamW(model.parameters(), lr=lr, weight_decay=1e-4)
    scheduler = ReduceLROnPlateau(
        optimizer, mode='min', factor=0.5, patience=5, min_lr=1e-6
    )

    # Load existing weights and optimizer state if resuming
    model.load(optimizer=optimizer, scheduler=scheduler)

    for epoch in range(epochs):
        model.train()
        epoch_loss, n = 0.0, 0

        for batch in loader:
            optimizer.zero_grad()
            loss = combined_loss(model, batch)
            if loss.requires_grad:
                loss.backward()
                torch.nn.utils.clip_grad_norm_(model.parameters(), grad_clip)
                optimizer.step()
            epoch_loss += loss.item()
            n += 1

        avg_loss = epoch_loss / max(n, 1)
        scheduler.step(avg_loss)

        if (epoch + 1) % 10 == 0:
            current_lr = optimizer.param_groups[0]['lr']
            print(f"Epoch {epoch+1}/{epochs} — loss: {avg_loss:.4f}  lr: {current_lr:.2e}")

    model.save(optimizer=optimizer, scheduler=scheduler)
    upload_weights()


if __name__ == '__main__':
    parameters, comparisons, ranks = fetch_data()
    model = ModularTransformer()
    train(model, parameters, comparisons, ranks, epochs=50)