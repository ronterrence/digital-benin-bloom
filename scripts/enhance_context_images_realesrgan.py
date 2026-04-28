from pathlib import Path

import cv2
from basicsr.archs.rrdbnet_arch import RRDBNet
from realesrgan import RealESRGANer

INPUT_DIR = Path(r"C:\Users\ron\Documents\project\digital-benin-bloom\data\raw\context_images")
OUTPUT_DIR = Path(r"C:\Users\ron\Documents\project\digital-benin-bloom\data\raw\context_images_enhanced4")

MODEL_PATH = Path(r"C:\Users\ron\Documents\project\weights\RealESRGAN_x4plus.pth")
UPSCALE = 2


def build_upsampler():
    model = RRDBNet(
        num_in_ch=3,
        num_out_ch=3,
        num_feat=64,
        num_block=23,
        num_grow_ch=32,
        scale=UPSCALE,
    )

    upsampler = RealESRGANer(
        scale=UPSCALE,
        model_path=str(MODEL_PATH),
        model=model,
        tile=0,          # set to e.g. 200 if you hit memory issues
        tile_pad=10,
        pre_pad=0,
        half=False,      # safer on Windows/CPU
    )
    return upsampler


def main():
    if not INPUT_DIR.exists():
        raise FileNotFoundError(f"Input folder not found: {INPUT_DIR}")

    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    upsampler = build_upsampler()

    supported = {".png", ".jpg", ".jpeg", ".webp", ".bmp"}
    files = [p for p in INPUT_DIR.iterdir() if p.suffix.lower() in supported]

    saved = 0
    skipped = 0

    for img_path in files:
        img = cv2.imread(str(img_path), cv2.IMREAD_COLOR)
        if img is None:
            print(f"Skipping unreadable file: {img_path.name}")
            skipped += 1
            continue

        try:
            output, _ = upsampler.enhance(img, outscale=UPSCALE)
        except Exception as e:
            print(f"Failed: {img_path.name} -> {e}")
            skipped += 1
            continue

        out_path = OUTPUT_DIR / img_path.name
        ok = cv2.imwrite(str(out_path), output)

        if ok:
            print(f"Saved: {out_path.name}")
            saved += 1
        else:
            print(f"Failed to write: {out_path.name}")
            skipped += 1

            print("Building upsampler...")
            upsampler = build_upsampler()
            print("Upsampler ready.")

    print("\nDone.")
    print(f"Saved: {saved}")
    print(f"Skipped: {skipped}")


if __name__ == "__main__":
    main()