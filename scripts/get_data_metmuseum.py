from pathlib import Path
import csv
import json
import re
import time
from urllib.parse import urlparse

import requests


PROJECT_ROOT = Path(__file__).resolve().parents[1]

OUTPUT_JSON = PROJECT_ROOT / "data" / "normalized" / "metmuseum_benin_objects.json"
OUTPUT_CSV = PROJECT_ROOT / "data" / "normalized" / "metmuseum_benin_objects.csv"
IMAGE_DIR = PROJECT_ROOT / "public" / "benin_output" / "metmuseum"

SEARCH_URL = "https://collectionapi.metmuseum.org/public/collection/v1/search"
OBJECT_URL = "https://collectionapi.metmuseum.org/public/collection/v1/objects/{object_id}"

SEARCH_QUERIES = [
    "Benin Nigeria",
    "Edo Nigeria",
    "Kingdom of Benin Nigeria",
    "Benin ivory Nigeria",
    "Benin brass Nigeria",
    "Benin court Nigeria",
    "Benin pendant mask",
]


MAX_OBJECTS = 250

FILTER_TO_BENIN_RELEVANT = True


def safe_filename(value: str) -> str:
    value = value.strip()
    value = re.sub(r"[^\w.\-]+", "_", value)
    value = value.strip("_")
    return value or "met_object"


def search_object_ids(query: str) -> list[int]:
    params = {
        "q": query,
        "hasImages": "true",
    }

    response = requests.get(SEARCH_URL, params=params, timeout=60)
    response.raise_for_status()

    data = response.json()
    return data.get("objectIDs") or []


def fetch_object(object_id: int) -> dict:
    response = requests.get(OBJECT_URL.format(object_id=object_id), timeout=60)
   
    if response.status_code in (403, 404):
        return None
    
    response.raise_for_status()
    return response.json()


def is_benin_relevant(raw: dict) -> bool:
    text = " ".join(
        str(raw.get(field) or "")
        for field in [
            "title",
            "objectName",
            "culture",
            "period",
            "dynasty",
            "reign",
            "portfolio",
            "artistDisplayName",
            "artistDisplayBio",
            "artistNationality",
            "city",
            "state",
            "county",
            "country",
            "region",
            "subregion",
            "locale",
            "locus",
            "excavation",
            "river",
            "classification",
            "medium",
            "creditLine",
            "department",
            "repository",
            "objectURL",
        ]
    ).lower()

    tags = raw.get("tags") or []
    tag_text = " ".join(str(tag.get("term") or "") for tag in tags).lower()

    combined = f"{text} {tag_text}"

    keywords = [
        "benin",
        "edo",
        "nigeria",
        "kingdom of benin",
    ]

    return any(keyword in combined for keyword in keywords)


def normalize_met_record(raw: dict) -> dict:
    object_id = raw.get("objectID")
    accession_number = raw.get("accessionNumber") or ""
    image_url = raw.get("primaryImage") or raw.get("primaryImageSmall") or ""

    ext = ".jpg"
    if image_url:
        parsed = urlparse(image_url)
        suffix = Path(parsed.path).suffix
        if suffix:
            ext = suffix

    base_name = safe_filename(accession_number or f"met_{object_id}")
    image_file = f"{base_name}{ext}" if image_url else ""

    return {
        "id": f"met_{object_id}",
        "object_id": object_id,
        "accession_number": accession_number,
        "accession_year": raw.get("accessionYear") or "",
        "title": raw.get("title") or "",
        "object_name": raw.get("objectName") or "",
        "department": raw.get("department") or "",
        "culture": raw.get("culture") or "",
        "period": raw.get("period") or "",
        "dynasty": raw.get("dynasty") or "",
        "reign": raw.get("reign") or "",
        "object_date": raw.get("objectDate") or "",
        "object_begin_date": raw.get("objectBeginDate"),
        "object_end_date": raw.get("objectEndDate"),
        "medium": raw.get("medium") or "",
        "dimensions": raw.get("dimensions") or "",
        "geography_type": raw.get("geographyType") or "",
        "city": raw.get("city") or "",
        "state": raw.get("state") or "",
        "county": raw.get("county") or "",
        "country": raw.get("country") or "",
        "region": raw.get("region") or "",
        "subregion": raw.get("subregion") or "",
        "locale": raw.get("locale") or "",
        "classification": raw.get("classification") or "",
        "credit_line": raw.get("creditLine") or "",
        "repository": raw.get("repository") or "",
        "gallery_number": raw.get("GalleryNumber") or "",
        "is_public_domain": bool(raw.get("isPublicDomain")),
        "rights_and_reproduction": raw.get("rightsAndReproduction") or "",
        "object_url": raw.get("objectURL") or raw.get("linkResource") or "",
        "object_wikidata_url": raw.get("objectWikidata_URL") or "",
        "primary_image": raw.get("primaryImage") or "",
        "primary_image_small": raw.get("primaryImageSmall") or "",
        "image_url": image_url,
        "image_file": image_file,
        "tags": "; ".join(
            tag.get("term", "")
            for tag in raw.get("tags", []) or []
            if tag.get("term")
        ),
        "metadata_date": raw.get("metadataDate") or "",
    }


def download_image(url: str, output_path: Path) -> bool:
    if not url:
        return False

    if output_path.exists() and output_path.stat().st_size > 0:
        return True

    response = requests.get(url, timeout=60)
    response.raise_for_status()

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_bytes(response.content)

    return True


def write_outputs(records: list[dict]) -> None:
    OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)

    OUTPUT_JSON.write_text(
        json.dumps(records, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    if not records:
        return

    fieldnames = list(records[0].keys())

    with OUTPUT_CSV.open("w", newline="", encoding="utf-8") as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(records)


def main() -> None:
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)

    all_ids: list[int] = []

    print("Searching Met API...")
    for query in SEARCH_QUERIES:
        ids = search_object_ids(query)
        print(f'Query "{query}" returned {len(ids)} object IDs')
        all_ids.extend(ids)
        time.sleep(0.2)

    unique_ids = list(dict.fromkeys(all_ids))

    print()
    print(f"Unique object IDs before limit: {len(unique_ids)}")

    if MAX_OBJECTS:
        unique_ids = unique_ids[:MAX_OBJECTS]

    print(f"Object IDs to inspect: {len(unique_ids)}")
    print()

    records = []
    downloaded = 0
    skipped_images = 0
    skipped_not_relevant = 0
    skipped_no_public_image = 0

    for index, object_id in enumerate(unique_ids, start=1):
        print(f"[{index}/{len(unique_ids)}] Fetching object {object_id}...")

        try:
            raw = fetch_object(object_id)

            if raw is None:
                print("  Skipped: object endpoint unavailable")
                continue
        
        except Exception as e:
            print(f"  Skipping object fetch error: {e}")
            continue

        if FILTER_TO_BENIN_RELEVANT and not is_benin_relevant(raw):
            skipped_not_relevant += 1
            print("  Skipped: not Benin/Edo/Nigeria relevant after full-record filter")
            continue

        record = normalize_met_record(raw)

        if not record["image_url"]:
            skipped_no_public_image += 1
            print("  Skipped: no public image URL")
            continue

        records.append(record)

        image_path = IMAGE_DIR / record["image_file"]

        try:
            if download_image(record["image_url"], image_path):
                downloaded += 1
                print(f"  Image saved/found: {image_path.name}")
        except Exception as e:
            skipped_images += 1
            print(f"  Image skipped: {e}")

        time.sleep(0.2)

    records.sort(
        key=lambda r: (
            str(r.get("accession_number") or ""),
            str(r.get("title") or ""),
        )
    )

    write_outputs(records)

    print()
    print("=== Met Museum Benin records built ===")
    print(f"Records written: {len(records)}")
    print(f"Images downloaded/found: {downloaded}")
    print(f"Images skipped: {skipped_images}")
    print(f"Skipped not relevant: {skipped_not_relevant}")
    print(f"Skipped no public image: {skipped_no_public_image}")
    print(f"JSON: {OUTPUT_JSON}")
    print(f"CSV: {OUTPUT_CSV}")
    print(f"Image directory: {IMAGE_DIR}")


if __name__ == "__main__":
    main()