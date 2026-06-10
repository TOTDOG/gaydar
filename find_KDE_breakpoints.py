import numpy as np
from scipy.stats import gaussian_kde
import torch

def build_sampler_fn(
    param: dict,
    uncertainties: list[float],
    sample_count: int,
    segments: int = 100,
    top_percentile: float = 0.25,
) -> dict:
    uncertainties = np.array(uncertainties)

    std = uncertainties.std()
    max_possible_std = (uncertainties.max() - uncertainties.min()) / 2
    std_weight = min(1.0, std / max_possible_std) if max_possible_std > 0 else 0.0
    count_weight = min(1.0, (sample_count / 200) ** 0.5)
    kde_weight = std_weight * count_weight

    if param["categories"]:
        return _build_nominal(uncertainties, kde_weight)
    else:
        return _build_continuous(
            param, uncertainties, kde_weight, segments, top_percentile
        )


def _build_continuous(
    param, uncertainties, kde_weight, segments, top_percentile
) -> dict:
    min_val, max_val = param["min"], param["max"]
    probe_values = np.linspace(min_val, max_val, len(uncertainties))

    threshold = np.percentile(uncertainties, (1 - top_percentile) * 100)
    observations = probe_values[uncertainties >= threshold]

    kde = gaussian_kde(observations)
    xs = np.linspace(min_val, max_val, segments * 10)
    dx = xs[1] - xs[0]

    uniform_density = 1.0 / (max_val - min_val)
    blended_pdf = kde_weight * kde.evaluate(xs) + (1 - kde_weight) * uniform_density

    cumulative = np.cumsum(blended_pdf * dx)
    cumulative /= cumulative[-1]

    rs = np.linspace(0, 1, segments + 1)
    xs_quantile = np.interp(rs, cumulative, xs)

    return {
        "breakpoints": rs.tolist(),
        "values": xs_quantile.tolist(),
    }


def _build_nominal(uncertainties, kde_weight) -> dict:
    n = len(uncertainties)
    uniform_weight = 1.0 / n

    kde_probs = uncertainties / uncertainties.sum()
    blended = kde_weight * kde_probs + (1 - kde_weight) * uniform_weight
    blended /= blended.sum()

    breakpoints = np.cumsum(blended).tolist()
    values = list(range(n))

    return {
        "breakpoints": breakpoints,
        "values": values,
    }

def probe_uncertainty(model, param_name, min_val, max_val, 
                      coarse_steps=50, refine_steps=50) -> tuple[np.ndarray, np.ndarray]:
    # Coarse pass
    coarse_xs = np.linspace(min_val, max_val, coarse_steps)
    coarse_us = np.array([get_uncertainty(model, param_name, x) for x in coarse_xs])

    # Refine around top 25% of coarse uncertainty
    threshold = np.percentile(coarse_us, 75)
    peak_regions = coarse_xs[coarse_us >= threshold]

    if len(peak_regions) == 0:
        return coarse_xs, coarse_us

    # Add extra probe points around peaks
    refined_xs = np.concatenate([
        np.linspace(max(min_val, x - (max_val - min_val) * 0.05),
                    min(max_val, x + (max_val - min_val) * 0.05),
                    refine_steps // len(peak_regions))
        for x in peak_regions
    ])

    all_xs = np.concatenate([coarse_xs, refined_xs])
    all_xs = np.unique(all_xs)
    all_us = np.array([get_uncertainty(model, param_name, x) for x in all_xs])

    return all_xs, all_us

def get_uncertainty(
    model: QuantileScoreModel,
    param_name: str,
    value: float,
    all_params: list[dict]
) -> float:
    model.eval()
    with torch.no_grad():
        inputs = { param["name"]: torch.tensor([[value]])
                   for param in all_params
                   if param["name"] == param_name }
        preds = model(inputs).squeeze()
        sorted_preds, _ = preds.sort()
        return float(sorted_preds[2] - sorted_preds[0])  # q90 - q10