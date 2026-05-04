from pathlib import Path
from PIL import Image
import shutil

from pathlib import Path

INPUT_FOLDER = Path(r"C:\Users\ron\Documents\project\digital-benin-bloom\data\raw\context_images2_enhanced")
OUTPUT_FOLDER = Path(r"C:\Users\ron\Documents\project\digital-benin-bloom\data\raw\context_images2_web")
MAX_MB = 1
MAX_BYTES = MAX_MB * 1024 * 1024

SUPPORTED_EXTENSIONS = [".jpg", ".jpeg", ".png"]

OUTPUT_FOLDER.mkdir(exist_ok=True)


def file_size_mb(path):
    return path.stat().st_size / (1024 * 1024)


def compress_image(input_path, output_path):
    img = Image.open(input_path)

    # Convert PNG transparency to white background
    if img.mode in ("RGBA", "LA"):
        background = Image.new("RGB", img.size, "white")
        background.paste(img, mask=img.split()[-1])
        img = background
    else:
        img = img.convert("RGB")

    quality = 90
    width, height = img.size

    while True:
        temp_output = output_path.with_suffix(".jpg")

        img.save(
            temp_output,
            "JPEG",
            quality=quality,
            optimize=True,
            progressive=True
        )

        if temp_output.stat().st_size <= MAX_BYTES:
            return temp_output

        quality -= 5

        # If quality becomes too low, reduce image dimensions
        if quality < 40:
            width = int(width * 0.85)
            height = int(height * 0.85)
            img = img.resize((width, height), Image.LANCZOS)
            quality = 85

        # Safety stop
        if width < 500 or height < 500:
            return temp_output


for file in INPUT_FOLDER.iterdir():
    if not file.is_file():
        continue

    if file.suffix.lower() not in SUPPORTED_EXTENSIONS:
        print(f"Skipped unsupported file: {file.name}")
        continue

    print(f"Processing: {file.name}")

    output_file = OUTPUT_FOLDER / f"{file.stem}_compressed.jpg"

    compressed_file = compress_image(file, output_file)

    print(
        f"Saved: {compressed_file.name} â€” "
        f"{file_size_mb(compressed_file):.2f} MB"
    )