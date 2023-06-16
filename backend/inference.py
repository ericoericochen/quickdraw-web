import torch
from torch import nn


def predict(model: nn.Module, x, labels: list[str], k=5, device="cpu"):
    model.eval()
    class_probabilities = {}

    with torch.no_grad():
        x = x.to(device).unsqueeze(0)
        pred = model(x)
        probabilities = nn.functional.softmax(pred, dim=1)
        top_k_indices = torch.topk(probabilities, k).indices

        for idx in top_k_indices[0].tolist():
            label = labels[idx]
            probability = probabilities[0][idx].item()
            class_probabilities[label] = probability

    return class_probabilities
