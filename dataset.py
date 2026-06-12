import torch
from torch.utils.data import Dataset, DataLoader, WeightedRandomSampler


class ParameterRegistry:
    """
    Wraps the Parameter table from the DB.
    Handles normalization for continuous values and one-hot encoding for nominal.
    """
    def __init__(self, parameters: list[dict]):
        self.params: dict[str, dict] = {p['id']: p for p in parameters}

    def parse_value(self, attr_id: str, value: dict) -> torch.Tensor:
        param = self.params[attr_id]

        if param['type'] == 'continuous':
            raw = float(value['value'])
            lo, hi = float(param['min']), float(param['max'])
            normalized = (raw - lo) / (hi - lo) if hi != lo else 0.0
            return torch.tensor([[normalized]])

        if param['type'] == 'nominal':
            classes = param['classes']
            one_hot = torch.zeros(1, len(classes))
            if value['class'] in classes:
                one_hot[0, classes.index(value['class'])] = 1.0
            return one_hot

        raise ValueError(f"Unknown type '{param['type']}' for id '{attr_id}'")

    def parse_set_parameters(self, set_parameters: list[dict]) -> dict[str, torch.Tensor]:
        """
        Converts a setParameters array into {id: tensor} dict.
        Silently skips inactive or unknown parameter ids.
        Raises KeyError during forward if an id appears that was not registered —
        meaning the parameter list and data are out of sync.
        """
        return {
            p['id']: self.parse_value(p['id'], p['value'])
            for p in set_parameters
            if p['id'] in self.params and self.params[p['id']]['active']
        }


class ComparisonDataset(Dataset):
    """
    Loads from Comparison records: { setParameters0, setParameters1, relate }
    relate: 0.0 = first scenario is better, 1.0 = second is better, 0.5 = tie
    """
    def __init__(self, records: list[dict], param_registry: ParameterRegistry):
        self.records = records
        self.param_registry = param_registry

    def __len__(self):
        return len(self.records)

    def __getitem__(self, idx):
        r = self.records[idx]
        return {
            'type': 'comparison',
            'scenario_a': self.param_registry.parse_set_parameters(r['setParameters0']),
            'scenario_b': self.param_registry.parse_set_parameters(r['setParameters1']),
            'relate': float(r['relate'])
        }


class RankDataset(Dataset):
    """
    Loads from Rank records: { setParameters, rank }
    """
    def __init__(self, records: list[dict], param_registry: ParameterRegistry):
        self.records = records
        self.param_registry = param_registry

    def __len__(self):
        return len(self.records)

    def __getitem__(self, idx):
        r = self.records[idx]
        return {
            'type': 'absolute',
            'scenario': self.param_registry.parse_set_parameters(r['setParameters']),
            'score': float(r['rank'])
        }


class CombinedDataset(Dataset):
    def __init__(self, parameters: list[dict],
                 comparison_records: list[dict],
                 rank_records: list[dict],
                 comp_weight: float = 2.0,
                 abs_weight: float = 1.0):
        param_registry = ParameterRegistry(parameters)
        self.comparison_ds = ComparisonDataset(comparison_records, param_registry)
        self.rank_ds = RankDataset(rank_records, param_registry)
        self._comp_weight = comp_weight
        self._abs_weight = abs_weight

    def __len__(self):
        return len(self.comparison_ds) + len(self.rank_ds)

    def __getitem__(self, idx):
        if idx < len(self.comparison_ds):
            return self.comparison_ds[idx]
        return self.rank_ds[idx - len(self.comparison_ds)]

    def make_loader(self, batch_size: int = 16) -> DataLoader:
        weights = (
            [self._comp_weight] * len(self.comparison_ds) +
            [self._abs_weight]  * len(self.rank_ds)
        )
        sampler = WeightedRandomSampler(
            weights, num_samples=len(weights), replacement=True
        )
        return DataLoader(
            self, batch_size=batch_size, sampler=sampler, collate_fn=list
        )