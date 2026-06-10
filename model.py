import torch
import torch.nn as nn
from encoders import EncoderRegistry, EMBED_DIM


class ModularTransformer(nn.Module):
    def __init__(self, num_heads: int = 4, num_layers: int = 2,
                 ffn_dim: int = 256, dropout: float = 0.1):
        super().__init__()
        self.registry = EncoderRegistry()

        encoder_layer = nn.TransformerEncoderLayer(
            d_model=EMBED_DIM,
            nhead=num_heads,
            dim_feedforward=ffn_dim,
            dropout=dropout,
            batch_first=True,
            activation='gelu',
            norm_first=True
        )
        self.transformer = nn.TransformerEncoder(encoder_layer, num_layers=num_layers)

        self.head = nn.Sequential(
            nn.Linear(EMBED_DIM, 128),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(128, 1)
        )

    def forward(self, scenario: dict[str, torch.Tensor]) -> torch.Tensor:
        """
        scenario: {attr_id: tensor(1, input_dim)} for each active parameter.
        Raises KeyError if an id appears that wasn't registered — means the
        parameter list and data are out of sync.
        """
        embeddings = torch.stack(
            [self.registry.encoders[aid](scenario[aid]) for aid in scenario],
            dim=1
        )  # (batch, num_active, EMBED_DIM)
        x = self.transformer(embeddings)
        return self.head(x.mean(dim=1)).squeeze(-1)  # (batch,)

    def save(self, path: str = 'model.pt', optimizer=None, scheduler=None):
        checkpoint = {
            'transformer': self.transformer.state_dict(),
            'head': self.head.state_dict(),
        }
        if optimizer is not None:
            checkpoint['optimizer'] = optimizer.state_dict()
        if scheduler is not None:
            checkpoint['scheduler'] = scheduler.state_dict()
        torch.save(checkpoint, path)
        self.registry.save()
        print(f"Saved model to {path}")

    def load(self, path: str = 'model.pt', optimizer=None, scheduler=None):
        import os
        if not os.path.exists(path):
            return  # fresh start, nothing to load
        self.registry.load_all()
        checkpoint = torch.load(path, weights_only=True)
        self.transformer.load_state_dict(checkpoint['transformer'])
        self.head.load_state_dict(checkpoint['head'])
        if optimizer and 'optimizer' in checkpoint:
            optimizer.load_state_dict(checkpoint['optimizer'])
        if scheduler and 'scheduler' in checkpoint:
            scheduler.load_state_dict(checkpoint['scheduler'])
        print(f"Loaded model from {path}")