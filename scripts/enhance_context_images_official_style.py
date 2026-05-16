from pathlib import Path
import cv2
import numpy as np
import torch

from basicsr.archs.rrdbnet_arch import RRDBNet
from realesrgan import RealESRGANer

# =========================
# PATHS
# =========================
INPUT_DIR = Path(r"C:\Users\ron\Documents\project\digital-benin-bloom\context_images")
OUTPUT_DIR = Path(r"C:\Users\ron\Documents\project\digital-benin-bloom\context_images3_enhanced")

MODEL_PATH = Path(r"C:\Users\ron\Documents\project\RealESRGAN_x4plus.pth")
UPSCALE = 4

# =========================
# SETTINGS FOR CONTEXT IMAGES
# =========================
USE_CUDA = True
FP32 = True              # safer on Windows / CPU
TILE = 256               # raise if GPU is strong; lower if memory issues
TILE_PAD = 16
PRE_PAD = 0

# Context-image specific options
FORCE_GRAYSCALE = False  # True if you want a documentary grayscale output
POST_CLAHE = True
CLAHE_CLIP = 1.8
CLAHE_GRID = (8, 8)

POST_GAMMA = True
GAMMA = 0.98

POST_SHARPEN = True
SHARPEN_AMOUNT = 0.55
SHARPEN_SIGMA = 1.1

# Turn on only for context portraits / faces if desired
USE_FACE_ENHANCE = True

# If True, only process filenames matching portrait-like cues
PORTRAIT_ONLY_FACE_ENHANCE = True


def get_device(use_cuda=True):
    if use_cuda and torch.cuda.is_available():
        return torch.device("cuda")
    return torch.device("cpu")


def build_upsampler(device):
    model = RRDBNet(
        num_in_ch=3,
        num_out_ch=3,
        num_feat=64,
        num_block=23,
        num_grow_ch=32,
        scale=4,
    )

    return RealESRGANer(
        scale=4,
        model_path=str(MODEL_PATH),
        model=model,
        tile=TILE,
        tile_pad=TILE_PAD,
        pre_pad=PRE_PAD,
        half=(device.type == "cuda" and not FP32),
        device=device,
    )


def build_face_enhancer(upsampler):
    from gfpgan import GFPGANer

    return GFPGANer(
        model_path='https://github.com/TencentARC/GFPGAN/releases/download/v1.3.0/GFPGANv1.3.pth',
        upscale=UPSCALE,
        arch='clean',
        channel_multiplier=2,
        bg_upsampler=upsampler,
    )


def apply_clahe_bgr(image_bgr, clip=1.8, grid=(8, 8)):
    lab = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=clip, tileGridSize=grid)
    l2 = clahe.apply(l)
    merged = cv2.merge((l2, a, b))
    return cv2.cvtColor(merged, cv2.COLOR_LAB2BGR)


def apply_gamma(image_bgr, gamma=1.0):
    if gamma == 1.0:
        return image_bgr
    inv_gamma = 1.0 / gamma
    table = np.array(
        [((i / 255.0) ** inv_gamma) * 255 for i in np.arange(256)],
        dtype=np.uint8
    )
    return cv2.LUT(image_bgr, table)


def unsharp_mask(image_bgr, sigma=1.1, amount=0.55):
    blurred = cv2.GaussianBlur(image_bgr, (0, 0), sigmaX=sigma, sigmaY=sigma)
    sharpened = cv2.addWeighted(image_bgr, 1 + amount, blurred, -amount, 0)
    return np.clip(sharpened, 0, 255).astype(np.uint8)


def maybe_force_grayscale(image_bgr):
    gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
    return cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)


def should_use_face_enhance(filename: str) -> bool:
    if not USE_FACE_ENHANCE:
        return False
    if not PORTRAIT_ONLY_FACE_ENHANCE:
        return True

    name = filename.lower()
    cues = [
        "portrait",
        "group",
        "official",
        "figure",
        "seated",
        "attendants",
        "expedition",
    ]
    return any(cue in name for cue in cues)


def post_process(image_bgr):
    out = image_bgr

    if FORCE_GRAYSCALE:
        out = maybe_force_grayscale(out)

    if POST_CLAHE:
        out = apply_clahe_bgr(out, clip=CLAHE_CLIP, grid=CLAHE_GRID)

    if POST_GAMMA:
        out = apply_gamma(out, gamma=GAMMA)

    if POST_SHARPEN:
        out = unsharp_mask(out, sigma=SHARPEN_SIGMA, amount=SHARPEN_AMOUNT)

    if FORCE_GRAYSCALE:
        out = maybe_force_grayscale(out)

    return out


def main():
    if not INPUT_DIR.exists():
        raise FileNotFoundError(f"Input folder not found: {INPUT_DIR}")
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    device = get_device(USE_CUDA)
    print(f"Using device: {device}")

    upsampler = build_upsampler(device)
    face_enhancer = build_face_enhancer(upsampler) if USE_FACE_ENHANCE else None

    supported = {".png", ".jpg", ".jpeg", ".bmp", ".webp", ".tif", ".tiff"}
    files = [p for p in INPUT_DIR.iterdir() if p.suffix.lower() in supported]

    saved = 0
    skipped = 0

    for img_path in files:
        print(f"Processing: {img_path.name}")
        img = cv2.imread(str(img_path), cv2.IMREAD_UNCHANGED)

        if img is None:
            print(f"  Skipped unreadable file: {img_path.name}")
            skipped += 1
            continue

        try:
            if should_use_face_enhance(img_path.name):
                _, _, output = face_enhancer.enhance(
                    img,
                    has_aligned=False,
                    only_center_face=False,
                    paste_back=True
                )
            else:
                output, _ = upsampler.enhance(img, outscale=UPSCALE)

            output = post_process(output)

            out_path = OUTPUT_DIR / img_path.name
            ok = cv2.imwrite(str(out_path), output)

            if ok:
                print(f"  Saved: {out_path.name}")
                saved += 1
            else:
                print(f"  Failed to write: {out_path.name}")
                skipped += 1

        except Exception as e:
            print(f"  Failed: {img_path.name} -> {e}")
            skipped += 1

    print("\nDone.")
    print(f"Saved: {saved}")
    print(f"Skipped: {skipped}")


if __name__ == "__main__":
    main()