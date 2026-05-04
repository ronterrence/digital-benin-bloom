from pathlib import Path
from PIL import Image

FOLDER = Path("data/raw/context_images2_enhanced")
MAX_WIDTH = 1800
QUALITY = 85

for file in FOLDER.glob("*.png"):
    size_mb = file.stat().st_size / (1024 * 1024)

    if size_mb < 50:
        continue

    print(f"Compressing {file.name}: {size_mb:.2f} MB")

    img = Image.open(file).convert("RGB")

    if img.width > MAX_WIDTH:
        ratio = MAX_WIDTH / img.width
        new_size = (MAX_WIDTH, int(img.height * ratio))
        img = img.resize(new_size, Image.LANCZOS)

    output = file.with_suffix(".jpg")
    img.save(output, "JPEG", quality=QUALITY, optimize=True)

    print(f"Saved {output.name}: {output.stat().st_size / (1024 * 1024):.2f} MB")