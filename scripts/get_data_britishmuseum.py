import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
import argparse
import csv
import json
import re
import time
from pathlib import Path
from urllib.parse import urlparse

import requests


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_INPUT = Path.home() / "Downloads" / "collections-26-04-30-22_23_36.csv"
DEFAULT_CSV_OUTPUT = PROJECT_ROOT / "data" / "normalized" / "britishmuseum_benin_objects.csv"
DEFAULT_JSON_OUTPUT = PROJECT_ROOT / "data" / "normalized" / "britishmuseum_benin_objects.json"
DEFAULT_IMAGE_DIR = PROJECT_ROOT / "public" / "benin_output" / "britishmuseum"


FIELDNAMES = [
    "id",
    "reg_number",
    "museum_number",
    "title",
    "object_type",
    "date",
    "culture",
    "ethnic_name",
    "production_place",
    "find_spot",
    "materials",
    "technique",
    "dimensions",
    "description",
    "curators_comments",
    "subjects",
    "location",
    "acquisition_date",
    "acquisition_notes",
    "expedition_note",
    "image_url",
    "image_file",
    "museum_url",
]


def clean_text(value):
    if value is None:
        return ""

    return re.sub(r"\s+", " ", str(value)).strip()


def strip_label(value, label):
    text = clean_text(value)
    prefix = f"{label}:"

    if text.lower().startswith(prefix.lower()):
        return text[len(prefix):].strip()

    return text


def extract_museum_number(row):
    reg_number = clean_text(row.get("Reg number"))

    if reg_number:
        return reg_number

    museum_number = clean_text(row.get("Museum number"))
    optional_match = re.search(r"Optional\[(.*?)\]", museum_number)

    if optional_match:
        return optional_match.group(1).strip()

    return museum_number


def make_id(museum_number):
    cleaned = clean_text(museum_number)
    cleaned = cleaned.replace(",", "_")
    cleaned = re.sub(r"[^A-Za-z0-9_.-]+", "_", cleaned)
    return cleaned.strip("_") or "unknown"


def make_image_filename(object_id, image_url):
    suffix = Path(urlparse(image_url).path).suffix.lower()

    if suffix not in [".jpg", ".jpeg", ".png", ".webp"]:
        suffix = ".jpg"

    return f"{object_id}{suffix}"


def make_museum_url(reg_number):
    if not reg_number:
        return ""

    object_slug = reg_number.replace(",", "-").replace(".", "-")
    return f"https://www.britishmuseum.org/collection/object/E_{object_slug}"


def combine_values(*values):
    seen = set()
    cleaned_values = []

    for value in values:
        text = clean_text(value)

        if text and text.lower() not in seen:
            seen.add(text.lower())
            cleaned_values.append(text)

    return "; ".join(cleaned_values)


def normalize_row(row):
    museum_number = extract_museum_number(row)
    object_id = make_id(museum_number)
    image_url = clean_text(row.get("Image"))

    return {
        "id": object_id,
        "reg_number": clean_text(row.get("Reg number")),
        "museum_number": museum_number,
        "title": clean_text(row.get("Title")),
        "object_type": clean_text(row.get("Object type")),
        "date": clean_text(row.get("Production date")),
        "culture": combine_values(row.get("Culture"), row.get("Ethnic name (made by)")),
        "ethnic_name": combine_values(row.get("Ethnic name (made by)"), row.get("Ethnic name (assoc)")),
        "production_place": strip_label(row.get("Production place"), "Made in"),
        "find_spot": strip_label(row.get("Find spot"), "Found/Acquired"),
        "materials": clean_text(row.get("Materials")),
        "technique": clean_text(row.get("Technique")),
        "dimensions": clean_text(row.get("Dimensions")),
        "description": clean_text(row.get("Description")),
        "curators_comments": clean_text(row.get("Curators Comments")),
        "subjects": clean_text(row.get("Subjects")),
        "location": clean_text(row.get("Location")),
        "acquisition_date": clean_text(row.get("Acq date")),
        "acquisition_notes": clean_text(row.get("Acq notes (acq)")),
        "expedition_note": clean_text(row.get("Acq notes (exc)")),
        "image_url": image_url,
        "image_file": make_image_filename(object_id, image_url) if image_url else "",
        "museum_url": make_museum_url(museum_number),
    }


def looks_benin_related(item):
    text = " ".join([
        item["title"],
        item["object_type"],
        item["culture"],
        item["production_place"],
        item["find_spot"],
        item["description"],
        item["acquisition_notes"],
        item["expedition_note"],
    ]).lower()

    return any(keyword in text for keyword in ["benin", "edo", "nigeria"])


def read_objects(csv_path, include_all=False):
    with open(csv_path, newline="", encoding="utf-8-sig") as csv_file:
        reader = csv.DictReader(csv_file)
        objects = [normalize_row(row) for row in reader]

    if include_all:
        return objects

    return [item for item in objects if looks_benin_related(item)]


def write_outputs(objects, csv_output, json_output):
    csv_output.parent.mkdir(parents=True, exist_ok=True)
    json_output.parent.mkdir(parents=True, exist_ok=True)

    with open(csv_output, "w", newline="", encoding="utf-8") as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=FIELDNAMES)
        writer.writeheader()
        writer.writerows(objects)

    with open(json_output, "w", encoding="utf-8") as json_file:
        json.dump(objects, json_file, indent=2, ensure_ascii=False)


def download_images(objects, image_dir, delay):
    image_dir.mkdir(parents=True, exist_ok=True)
    downloaded = 0
    skipped = 0

    for item in objects:
        image_url = item["image_url"]
        image_file = item["image_file"]

        if not image_url or not image_file:
            skipped += 1
            continue

        output_path = image_dir / image_file

        if output_path.exists():
            skipped += 1
            continue

        try:
            response = requests.get(image_url, timeout=30, verify=False)
            response.raise_for_status()
        except requests.exceptions.RequestException as exc:
            skipped += 1
            print(f"Skipping {item['id']}: {exc}")
            continue

        with open(output_path, "wb") as image_file_handle:
            image_file_handle.write(response.content)

        downloaded += 1
        print(f"Downloaded {item['id']} -> {output_path.name}")

        if delay:
            time.sleep(delay)

    return downloaded, skipped


def parse_args():
    parser = argparse.ArgumentParser(
        description="Normalize a British Museum Collection Online CSV export for Benin objects."
    )
    parser.add_argument(
        "--input",
        default=str(DEFAULT_INPUT),
        help=f"Path to the British Museum CSV export. Default: {DEFAULT_INPUT}",
    )
    parser.add_argument(
        "--csv-output",
        default=str(DEFAULT_CSV_OUTPUT),
        help=f"Clean CSV output path. Default: {DEFAULT_CSV_OUTPUT}",
    )
    parser.add_argument(
        "--json-output",
        default=str(DEFAULT_JSON_OUTPUT),
        help=f"Clean JSON output path. Default: {DEFAULT_JSON_OUTPUT}",
    )
    parser.add_argument(
        "--image-dir",
        default=str(DEFAULT_IMAGE_DIR),
        help=f"Downloaded image directory. Default: {DEFAULT_IMAGE_DIR}",
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Keep every row from the export instead of filtering for Benin/Edo/Nigeria terms.",
    )
    parser.add_argument(
        "--no-images",
        action="store_true",
        help="Only create CSV/JSON outputs; do not download images.",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=0.2,
        help="Delay between image downloads in seconds. Default: 0.2",
    )
    return parser.parse_args()


def main():
    args = parse_args()
    input_path = Path(args.input)
    csv_output = Path(args.csv_output)
    json_output = Path(args.json_output)
    image_dir = Path(args.image_dir)

    if not input_path.exists():
        raise SystemExit(f"Input CSV not found: {input_path}")

    objects = read_objects(input_path, include_all=args.all)
    write_outputs(objects, csv_output, json_output)

    print(f"Read: {input_path}")
    print(f"Objects written: {len(objects)}")
    print(f"CSV: {csv_output}")
    print(f"JSON: {json_output}")

    if args.no_images:
        return

    downloaded, skipped = download_images(objects, image_dir, args.delay)
    print(f"Images downloaded: {downloaded}")
    print(f"Images skipped: {skipped}")
    print(f"Image directory: {image_dir}")


if __name__ == "__main__":
    main()
