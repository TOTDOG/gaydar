import torch
import torch.nn.functional as F
from model import DEVICE


def absolute_loss(pred: torch.Tensor, score: float) -> torch.Tensor:
    target = torch.tensor([score], dtype=torch.float32, device=DEVICE)
    return F.mse_loss(pred, target)


def comparison_loss(score_a: torch.Tensor, score_b: torch.Tensor,
                    relate: float) -> torch.Tensor:
    """
    relate = 0.0: scenario_a is better  -> score_a should be higher
    relate = 1.0: scenario_b is better  -> score_b should be higher
    relate = 0.5: tie                   -> scores should be equal

    Distance from 0.5 scales the margin:
      relate=0.0 or 1.0 -> margin 0.3 (certain)
      relate=0.5        -> MSE (tie)
    """
    if abs(relate - 0.5) < 1e-6:
        return F.mse_loss(score_a, score_b)

    margin = abs(relate - 0.5) * 0.6  # 0.0-0.3 range
    target = torch.ones(1, device=DEVICE)

    if relate < 0.5:
        return F.margin_ranking_loss(score_a, score_b, target, margin=margin)
    else:
        return F.margin_ranking_loss(score_b, score_a, target, margin=margin)


def combined_loss(model, batch: list[dict],
                  abs_w: float = 1.0, comp_w: float = 0.5) -> torch.Tensor:
    abs_losses, comp_losses = [], []

    for sample in batch:
        if sample['type'] == 'absolute':
            pred = model(sample['scenario'])
            abs_losses.append(absolute_loss(pred, sample['score']))

        elif sample['type'] == 'comparison':
            score_a = model(sample['scenario_a'])
            score_b = model(sample['scenario_b'])
            comp_losses.append(comparison_loss(score_a, score_b, sample['relate']))

    total = torch.tensor(0.0, device=DEVICE)
    if abs_losses:
        total = total + abs_w * torch.stack(abs_losses).mean()
    if comp_losses:
        total = total + comp_w * torch.stack(comp_losses).mean()
    return total