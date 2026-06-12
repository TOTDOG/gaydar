import os
import torch
import torch.nn as nn
import torch.nn.functional as F
from pathlib import Path

EMBED_DIM = 384
_sentence_model = None


def get_sentence_model():
    global _sentence_model
    if _sentence_model is None:
        from sentence_transformers import SentenceTransformer
        _sentence_model = SentenceTransformer('all-MiniLM-L6-v2')
    return _sentence_model


def encode_description(description: str) -> torch.Tensor:
    with torch.no_grad():
        return get_sentence_model().encode(description, convert_to_tensor=True)


def get_weights_dir() -> Path:
    """
    Resolves the correct weights directory depending on environment:
    - Kaggle:     /kaggle/working/weights
    - HF Space:   /app/weights  (downloaded from HF model repo on startup)
    - Local:      ./weights
    """
    if os.path.exists('/kaggle/working'):
        base = Path('/kaggle/working')
    elif os.path.exists('/app'):
        base = Path('/app/weights')
    else:
        base = Path('.')
    path = base / 'encoder_weights'
    path.mkdir(parents=True, exist_ok=True)
    return path


def get_model_path() -> Path:
    if os.path.exists('/kaggle/working'):
        return Path('/kaggle/working/model.pt')
    elif os.path.exists('/app'):
        return Path('/app/weights/model.pt')
    else:
        return Path('model.pt')


class InputEncoder(nn.Module):
    def __init__(self, input_dim: int, description: str):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, 128),
            nn.GELU(),
            nn.Linear(128, EMBED_DIM)
        )
        anchor = encode_description(description)
        self.register_buffer('semantic_anchor', anchor)
        with torch.no_grad():
            nn.init.zeros_(self.net[-1].weight)
            self.net[-1].bias.copy_(anchor)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.net(x)


class EncoderRegistry:
    def __init__(self):
        self.encoders = nn.ModuleDict()
        self.descriptions: dict[str, str] = {}

    def has(self, attr_id: str) -> bool:
        return attr_id in self.encoders

    def register_all(self, parameters: list[dict], temperature: float = 0.2):
        """
        Register encoders for all active parameters.
        Safe to call multiple times — skips already registered ids.
        """
        for param in parameters:
            if not param['active'] or self.has(param['id']):
                continue
            input_dim = len(param['classes']) if param['type'] == 'nominal' else 1
            self._add(param['id'], param['description'], input_dim, temperature)

    def _add(self, attr_id: str, description: str,
             input_dim: int, temperature: float = 0.2):
        encoder = InputEncoder(input_dim, description)

        if len(self.encoders) > 0:
            similarities, drifts = [], []
            for enc in self.encoders.values():
                drift = enc.net[-1].bias.detach() - enc.semantic_anchor
                sim = F.cosine_similarity(
                    encoder.semantic_anchor.unsqueeze(0),
                    enc.semantic_anchor.unsqueeze(0)
                ).item()
                similarities.append(sim)
                drifts.append(drift)
            weights = F.softmax(torch.tensor(similarities) / temperature, dim=0)
            weighted_drift = sum(w * d for w, d in zip(weights, drifts))
            with torch.no_grad():
                encoder.net[-1].bias.add_(weighted_drift)

        self.encoders[attr_id] = encoder
        self.descriptions[attr_id] = description

    def save(self):
        save_dir = get_weights_dir()
        for attr_id, encoder in self.encoders.items():
            torch.save({
                'state_dict': encoder.state_dict(),
                'description': self.descriptions[attr_id]
            }, save_dir / f"{attr_id}.pt")
        print(f"Saved {len(self.encoders)} encoders to {save_dir}")

    def load_all(self):
        save_dir = get_weights_dir()
        for path in save_dir.glob('*.pt'):
            attr_id = path.stem
            checkpoint = torch.load(path, weights_only=False)
            desc = checkpoint['description']
            input_dim = checkpoint['state_dict']['net.0.weight'].shape[1]
            encoder = InputEncoder(input_dim, desc)
            encoder.load_state_dict(checkpoint['state_dict'])
            self.encoders[attr_id] = encoder
            self.descriptions[attr_id] = desc
        print(f"Loaded {len(self.encoders)} encoders from {save_dir}")