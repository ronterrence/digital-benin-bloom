#!/usr/bin/env python
"""
Rank likely visual/form matches between two image folders.

The script first compares compact perceptual hashes that are resilient to
resize and light compression changes. If OpenCV is installed, it also uses ORB
feature matching on the best candidates to improve matches across different
scans, crops, and backgrounds.
"""

from __future__ import annotations

import argparse
import csv
import math
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

LOCAL_PACKAGES = Path(__file__).resolve().parents[1] / ".python-packages"
if LOCAL_PACKAGES.exists():
    sys.path.insert(0, str(LOCAL_PACKAGES))

import numpy as np
from PIL import Image, ImageFilter, ImageOps, UnidentifiedImageError

try:
    import cv2  # type: ignore
except ImportError:  # pragma: no cover - depends on local environment
    cv2 = None


IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".tif",
    ".tiff",
    ".bmp",
}


@dataclass(frozen=True)
class ImageFingerprint:
    path: Path
    phash: int
    dhash: int
    edge_hash: int


@dataclass(frozen=True)
class Candidate:
    source: ImageFingerprint
    target: ImageFingerprint
    phash_distance: int
    dhash_distance: int
    edge_distance: int
    visual_distance: float


def image_paths(folder: Path) -> list[Path]:
    return sorted(
        path
        for path in folder.rglob("*")
        if path.is_file() and path.suffix.lower() in IMAGE_EXTENSIONS
    )


def open_image(path: Path, mode: str = "L") -> Image.Image:
    with Image.open(path) as image:
        return ImageOps.exif_transpose(image).convert(mode)


def dct_matrix(size: int) -> np.ndarray:
    matrix = np.empty((size, size), dtype=np.float64)
    factor = math.pi / (2 * size)
    scale0 = math.sqrt(1 / size)
    scale = math.sqrt(2 / size)

    for row in range(size):
        row_scale = scale0 if row == 0 else scale
        for col in range(size):
            matrix[row, col] = row_scale * math.cos((2 * col + 1) * row * factor)

    return matrix


DCT_32 = dct_matrix(32)


def bits_to_int(bits: Iterable[bool]) -> int:
    value = 0
    for bit in bits:
        value = (value << 1) | int(bit)
    return value


def phash(image: Image.Image) -> int:
    small = image.resize((32, 32), Image.Resampling.LANCZOS)
    pixels = np.asarray(small, dtype=np.float64)
    dct = DCT_32 @ pixels @ DCT_32.T
    low_frequency = dct[:8, :8].copy()
    values = low_frequency.flatten()
    median = np.median(values[1:])
    return bits_to_int(value > median for value in values)


def dhash(image: Image.Image) -> int:
    small = image.resize((9, 8), Image.Resampling.LANCZOS)
    pixels = np.asarray(small, dtype=np.int16)
    return bits_to_int(pixels[:, :-1].flatten() > pixels[:, 1:].flatten())


def edge_hash(image: Image.Image) -> int:
    edges = image.filter(ImageFilter.FIND_EDGES).resize((8, 8), Image.Resampling.LANCZOS)
    pixels = np.asarray(edges, dtype=np.float64).flatten()
    median = np.median(pixels)
    return bits_to_int(value > median for value in pixels)


def hamming(left: int, right: int) -> int:
    return (left ^ right).bit_count()


def fingerprint(path: Path) -> ImageFingerprint | None:
    try:
        image = open_image(path)
    except (OSError, UnidentifiedImageError) as exc:
        print(f"Skipping unreadable image: {path} ({exc})")
        return None

    return ImageFingerprint(
        path=path,
        phash=phash(image),
        dhash=dhash(image),
        edge_hash=edge_hash(image),
    )


def visual_candidate(source: ImageFingerprint, target: ImageFingerprint) -> Candidate:
    phash_distance = hamming(source.phash, target.phash)
    dhash_distance = hamming(source.dhash, target.dhash)
    edge_distance = hamming(source.edge_hash, target.edge_hash)
    visual_distance = (
        (0.50 * phash_distance)
        + (0.25 * dhash_distance)
        + (0.25 * edge_distance)
    )

    return Candidate(
        source=source,
        target=target,
        phash_distance=phash_distance,
        dhash_distance=dhash_distance,
        edge_distance=edge_distance,
        visual_distance=visual_distance,
    )


def compute_fingerprints(paths: list[Path], label: str) -> list[ImageFingerprint]:
    fingerprints: list[ImageFingerprint] = []
    total = len(paths)

    for index, path in enumerate(paths, start=1):
        item = fingerprint(path)
        if item is not None:
            fingerprints.append(item)

        if index == total or index % 50 == 0:
            print(f"{label}: fingerprinted {index}/{total}")

    return fingerprints


def best_candidates(
    source_images: list[ImageFingerprint],
    target_images: list[ImageFingerprint],
    top_n: int,
) -> list[Candidate]:
    all_candidates: list[Candidate] = []
    total = len(source_images)

    for index, source in enumerate(source_images, start=1):
        ranked = sorted(
            (visual_candidate(source, target) for target in target_images),
            key=lambda candidate: candidate.visual_distance,
        )
        all_candidates.extend(ranked[:top_n])

        if index == total or index % 25 == 0:
            print(f"Compared {index}/{total} source images")

    return all_candidates


def orb_match(source_path: Path, target_path: Path, max_size: int) -> tuple[int, int, int, int, float]:
    if cv2 is None:
        return 0, 0, 0, 0, 0.0

    left = cv2.imread(str(source_path), cv2.IMREAD_GRAYSCALE)
    right = cv2.imread(str(target_path), cv2.IMREAD_GRAYSCALE)
    if left is None or right is None:
        return 0, 0, 0, 0, 0.0

    left = resize_for_cv(left, max_size)
    right = resize_for_cv(right, max_size)

    orb = cv2.ORB_create(nfeatures=2500)
    left_keypoints, left_descriptors = orb.detectAndCompute(left, None)
    right_keypoints, right_descriptors = orb.detectAndCompute(right, None)

    if left_descriptors is None or right_descriptors is None:
        return len(left_keypoints), len(right_keypoints), 0, 0, 0.0

    matcher = cv2.BFMatcher(cv2.NORM_HAMMING)
    nearest = matcher.knnMatch(left_descriptors, right_descriptors, k=2)
    ratio_matches = [
        first
        for first, second in (pair for pair in nearest if len(pair) == 2)
        if first.distance < 0.75 * second.distance
    ]

    inlier_matches = 0
    if len(ratio_matches) >= 4:
        source_points = np.float32(
            [left_keypoints[match.queryIdx].pt for match in ratio_matches]
        ).reshape(-1, 1, 2)
        target_points = np.float32(
            [right_keypoints[match.trainIdx].pt for match in ratio_matches]
        ).reshape(-1, 1, 2)
        _, mask = cv2.findHomography(source_points, target_points, cv2.RANSAC, 5.0)
        if mask is not None:
            inlier_matches = int(mask.ravel().sum())

    score = inlier_matches / max(min(len(left_keypoints), len(right_keypoints)), 1)

    return len(left_keypoints), len(right_keypoints), len(ratio_matches), inlier_matches, score


def resize_for_cv(image: np.ndarray, max_size: int) -> np.ndarray:
    height, width = image.shape[:2]
    longest = max(height, width)
    if longest <= max_size:
        return image

    scale = max_size / longest
    return cv2.resize(  # type: ignore[union-attr]
        image,
        (int(width * scale), int(height * scale)),
        interpolation=cv2.INTER_AREA,  # type: ignore[union-attr]
    )


def match_band(visual_distance: float, inlier_matches: int, orb_score: float) -> str:
    if visual_distance <= 10 or (inlier_matches >= 12 and orb_score >= 0.04):
        return "strong"
    if visual_distance <= 18 or (inlier_matches >= 6 and orb_score >= 0.02):
        return "possible"
    return "weak"


def write_csv(candidates: list[Candidate], output_path: Path, max_size: int) -> None:
    rows = []
    total = len(candidates)

    for index, candidate in enumerate(candidates, start=1):
        left_keypoints, right_keypoints, good_matches, inlier_matches, orb_score = orb_match(
            candidate.source.path,
            candidate.target.path,
            max_size=max_size,
        )
        combined_score = (100 - candidate.visual_distance) + (orb_score * 100)

        rows.append(
            {
                "source_image": str(candidate.source.path),
                "candidate_image": str(candidate.target.path),
                "phash_distance": candidate.phash_distance,
                "dhash_distance": candidate.dhash_distance,
                "edge_distance": candidate.edge_distance,
                "visual_distance": round(candidate.visual_distance, 3),
                "orb_keypoints_source": left_keypoints,
                "orb_keypoints_candidate": right_keypoints,
                "orb_good_matches": good_matches,
                "orb_inlier_matches": inlier_matches,
                "orb_score": round(orb_score, 5),
                "combined_score": round(combined_score, 5),
                "match_band": match_band(
                    candidate.visual_distance,
                    inlier_matches,
                    orb_score,
                ),
            }
        )

        if index == total or index % 100 == 0:
            print(f"Ranked {index}/{total} candidate pairs")

    rows.sort(
        key=lambda row: (
            str(row["match_band"]) == "strong",
            float(row["combined_score"]),
            -float(row["visual_distance"]),
        ),
        reverse=True,
    )

    with output_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0].keys()) if rows else [])
        writer.writeheader()
        writer.writerows(rows)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Compare two image folders and rank likely visual/form matches."
    )
    parser.add_argument(
        "--source",
        type=Path,
        default=Path(r"C:\Users\ron\Documents\project\images"),
        help="Folder containing source images to look up.",
    )
    parser.add_argument(
        "--target",
        type=Path,
        default=Path(
            r"C:\Users\ron\Documents\project\digital-benin-bloom\public\benin_output\atlas\oxford"
        ),
        help="Folder containing candidate images.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("image-visual-form-matches.csv"),
        help="CSV path to write.",
    )
    parser.add_argument(
        "--top-n",
        type=int,
        default=8,
        help="Number of best visual-hash candidates to keep per source image.",
    )
    parser.add_argument(
        "--max-size",
        type=int,
        default=1200,
        help="Largest dimension used during optional OpenCV matching.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    source = args.source.resolve()
    target = args.target.resolve()
    output = args.output.resolve()

    if not source.exists():
        raise SystemExit(f"Source folder does not exist: {source}")
    if not target.exists():
        raise SystemExit(f"Target folder does not exist: {target}")

    if cv2 is None:
        print("OpenCV is not installed; ORB feature matching will be skipped.")
        print("Install opencv-python to improve matches across scans/crops.")

    source_paths = image_paths(source)
    target_paths = image_paths(target)
    print(f"Source images: {len(source_paths)}")
    print(f"Target images: {len(target_paths)}")

    if not source_paths or not target_paths:
        raise SystemExit("Both folders need at least one readable image.")

    source_fingerprints = compute_fingerprints(source_paths, "source")
    target_fingerprints = compute_fingerprints(target_paths, "target")
    candidates = best_candidates(source_fingerprints, target_fingerprints, top_n=args.top_n)
    write_csv(candidates, output, max_size=args.max_size)

    print(f"Wrote {len(candidates)} ranked candidate pairs to {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
