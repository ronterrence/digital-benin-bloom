import csv
from pathlib import Path

import fitz  # PyMuPDF
from PIL import Image, ImageChops

PDF_PATH = "benincollections_danhicks.pdf"
CSV_PATH = "data/normalized/oxford_artifact_images_clean.csv"
OUTPUT_DIR = "public/benin_output/atlas/oxford"
ZOOM = 3


def safe_filename(name):
    bad = '<>:"/\\|?*'
    cleaned = "".join("_" if c in bad else c for c in name)
    return cleaned.strip()


def render_page_to_pil(page, zoom=3):
    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat, alpha=False)
    return Image.frombytes("RGB", [pix.width, pix.height], pix.samples)


def estimate_bg_color(img):
    w, h = img.size
    samples = [
        img.getpixel((5, 5)),
        img.getpixel((w - 6, 5)),
        img.getpixel((5, h - 6)),
        img.getpixel((w - 6, h - 6)),
    ]
    r = sum(p[0] for p in samples) // len(samples)
    g = sum(p[1] for p in samples) // len(samples)
    b = sum(p[2] for p in samples) // len(samples)
    return (r, g, b)


def trim_to_content(img, threshold=18, padding=24):
    bg = Image.new(img.mode, img.size, estimate_bg_color(img))
    diff = ImageChops.difference(img, bg).convert("L")
    mask = diff.point(lambda p: 255 if p > threshold else 0)
    bbox = mask.getbbox()
    if not bbox:
        return img

    left, top, right, bottom = bbox
    left = max(0, left - padding)
    top = max(0, top - padding)
    right = min(img.width, right + padding)
    bottom = min(img.height, bottom + padding)

    return img.crop((left, top, right, bottom))


def crop_oxford_object_region(img):
    w, h = img.size

    candidate = img.crop((
        int(w * 0.10),
        int(h * 0.06),
        int(w * 0.96),
        int(h * 0.78),
    ))

    candidate = trim_to_content(candidate, threshold=16, padding=18)
    return candidate


def read_rows(csv_path):
    with open(csv_path, "r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))

def main():
    pdf_file = Path(PDF_PATH)
    csv_file = Path(CSV_PATH)
    out_dir = Path(OUTPUT_DIR)

    if not pdf_file.exists():
        raise FileNotFoundError(f"Missing PDF: {pdf_file}")

    if not csv_file.exists():
        raise FileNotFoundError(f"Missing CSV: {csv_file}")

    out_dir.mkdir(parents=True, exist_ok=True)

    rows = read_rows(csv_file)
    doc = fitz.open(str(pdf_file))

    saved = 0
    skipped = 0
    seen_image_files = set()

    for row in rows:
        accession = (row.get("accession_number") or "").strip()
        source_page = (row.get("source_page") or "").strip()
        image_status = (row.get("image_status") or "").strip().lower()
        image_file = (row.get("image_file") or "").strip()

        if not accession or not source_page:
            skipped += 1
            continue

        if image_status != "available":
            skipped += 1
            continue

        if image_file:
            normalized_image_file = safe_filename(image_file)
            if normalized_image_file in seen_image_files:
                skipped += 1
                continue
            seen_image_files.add(normalized_image_file)

        page_index = int(source_page) - 1
        if page_index < 0 or page_index >= len(doc):
            print(f"Skipping {accession}: invalid source page {source_page}")
            skipped += 1
            continue

        page = doc[page_index]
        full_img = render_page_to_pil(page, zoom=ZOOM)
        cropped = crop_oxford_object_region(full_img)

        if image_file:
            filename = safe_filename(image_file)
        else:
            filename = safe_filename(f"{accession}.png")

        output_path = out_dir / filename

        # overwrite deterministically instead of creating _1, _2, etc.
        cropped.save(output_path)
        print(f"Saved: {output_path}")
        saved += 1

    print("\nDone.")
    print(f"Saved crops: {saved}")
    print(f"Skipped rows: {skipped}")


if __name__ == "__main__":
    main()