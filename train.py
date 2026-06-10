import torch
from torch.optim import AdamW
from torch.optim.lr_scheduler import CosineAnnealingLR

from model import ModularTransformer
from dataset import CombinedDataset
from losses import combined_loss


import torch
from torch.optim import AdamW
from torch.optim.lr_scheduler import ReduceLROnPlateau

from model import ModularTransformer
from dataset import CombinedDataset
from losses import combined_loss

import psycopg2
import os
from dotenv import load_dotenv

load_dotenv('.env.local')

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



def train(model: ModularTransformer,
          parameters: list[dict],
          comparison_records: list[dict],
          rank_records: list[dict],
          epochs: int = 50,
          lr: float = 1e-3,
          batch_size: int = 16,
          grad_clip: float = 1.0,
          save_path: str = 'model.pt'):
    """
    To start fresh:
        model = ModularTransformer()
        train(model, parameters, comparisons, ranks)

    To resume:
        model = ModularTransformer()
        optimizer = AdamW(model.parameters(), lr=1e-3, weight_decay=1e-4)
        scheduler = ReduceLROnPlateau(optimizer)
        model.load(optimizer=optimizer, scheduler=scheduler)
        model.registry.register_all(parameters)
        train(model, parameters, comparisons, ranks)
    """
    model.registry.register_all(parameters)

    dataset = CombinedDataset(parameters, comparison_records, rank_records)
    loader = dataset.make_loader(batch_size)

    optimizer = AdamW(model.parameters(), lr=lr, weight_decay=1e-4)
    scheduler = ReduceLROnPlateau(optimizer, mode='min', factor=0.5,
                                  patience=5, min_lr=1e-6)

    # Load optimizer and scheduler states if resuming
    model.load(save_path, optimizer=optimizer, scheduler=scheduler)

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

    model.save(save_path, optimizer=optimizer, scheduler=scheduler)


# --- Example usage ---
if __name__ == '__main__':
    parameters, comparisons, ranks = fetch_data()
    model = ModularTransformer()
    train(model, parameters, comparisons, ranks, epochs=50)