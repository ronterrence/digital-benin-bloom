from pathlib import Path
import json
import re

import numpy as np
from PIL import Image
import torch
from torch import nn
from torchvision import models, transforms
from sklearn.manifold import TSNE

# CHANGE THIS to the folder that contains your Pitts main images like fig_001.jpg
IMAGE_DIR = Path(r"C:\Users\ron\Documents\project\benin_output_plates_clean") 
OUTPUT_PATH = Path(r"C:\Users\ron\Documents\project\digital-benin-bloom\data\normalized\artifact_map_layout.json")

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
IMAGE_SIZE = 224
BATCH_SIZE = 16


def natural_key(s: str):
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", s)]


def collect_images(image_dir: Path):
    files = []
    for ext in ("*.jpg", "*.jpeg", "*.png", "*.webp"):
        files.extend(image_dir.glob(ext))

    # keep only Pitts figure-style images
    rows = []
    for p in files:
        stem = p.stem
        if re.fullmatch(r"fig_\d+[a-zA-Z]?", stem):
            rows.append({"id": stem, "path": p})

    rows.sort(key=lambda r: natural_key(r["id"]))
    return rows


def build_model():
    weights = models.ResNet50_Weights.DEFAULT
    model = models.resnet50(weights=weights)
    feature_extractor = nn.Sequential(*list(model.children())[:-1]).to(DEVICE).eval()
    preprocess = weights.transforms()
    return feature_extractor, preprocess


def load_batch(paths, preprocess):
    imgs = []
    for p in paths:
        img = Image.open(p).convert("RGB")
        imgs.append(preprocess(img))
    return torch.stack(imgs, dim=0)


@torch.no_grad()
def embed_images(rows, model, preprocess):
    feats = []
    for i in range(0, len(rows), BATCH_SIZE):
        batch_rows = rows[i:i + BATCH_SIZE]
        batch = load_batch([r["path"] for r in batch_rows], preprocess).to(DEVICE)
        out = model(batch).flatten(1)
        out = torch.nn.functional.normalize(out, dim=1)
        feats.append(out.cpu().numpy())
        print(f"Embedded {min(i + BATCH_SIZE, len(rows))}/{len(rows)}")
    return np.concatenate(feats, axis=0)


def reduce_to_2d(features):
    perplexity = min(30, max(5, (len(features) - 1) // 3))
    tsne = TSNE(
        n_components=2,
        perplexity=perplexity,
        init="pca",
        learning_rate="auto",
        random_state=42,
    )
    coords = tsne.fit_transform(features)

    # normalize to 0..1 for easier front-end rendering
    mins = coords.min(axis=0)
    maxs = coords.max(axis=0)
    span = np.where((maxs - mins) == 0, 1, (maxs - mins))
    norm = (coords - mins) / span
    return norm


def main():
    if not IMAGE_DIR.exists():
        raise FileNotFoundError(f"Image folder not found: {IMAGE_DIR}")

    rows = collect_images(IMAGE_DIR)
    if not rows:
        raise RuntimeError("No Pitts figure images found in IMAGE_DIR")

    print(f"Found {len(rows)} Pitts images")

    model, preprocess = build_model()
    features = embed_images(rows, model, preprocess)
    coords = reduce_to_2d(features)

    output = []
    for row, (x, y) in zip(rows, coords):
        output.append({
            "id": row["id"],
            "x": float(x),
            "y": float(y),
        })

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(output, indent=2), encoding="utf-8")

    print(f"Saved layout: {OUTPUT_PATH}")
    print(f"Rows: {len(output)}")


if __name__ == "__main__":
    main()