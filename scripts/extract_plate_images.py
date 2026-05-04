from pathlib import Path
import shutil
import re

SOURCE_DIR = Path(r"C:\Users\ron\Documents\project\benin_output\plates")
OUTPUT_DIR = Path(r"C:\Users\ron\Documents\project\benin_output_plates_clean")

PLATE_PATTERN = re.compile(r"^(fig_\d+)_plate\.(jpg|jpeg|png|webp)$", re.IGNORECASE)

def main():
    if not SOURCE_DIR.exists():
        raise FileNotFoundError(f"Source folder not found: {SOURCE_DIR}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    copied = 0
    skipped = 0

    for path in SOURCE_DIR.rglob("*"):
        if not path.is_file():
            continue

        match = PLATE_PATTERN.fullmatch(path.name)
        if not match:
            skipped += 1
            continue

        artifact_id = match.group(1)
        ext = path.suffix.lower()
        new_name = f"{artifact_id}{ext}"
        target = OUTPUT_DIR / new_name

        # avoid overwrite if duplicates somehow exist
        counter = 1
        while target.exists():
            target = OUTPUT_DIR / f"{artifact_id}_{counter}{ext}"
            counter += 1

        shutil.copy2(path, target)
        print(f"Copied: {path.name} -> {target.name}")
        copied += 1

    print("\nDone.")
    print(f"Copied and renamed plate files: {copied}")
    print(f"Skipped other files: {skipped}")
    print(f"Output folder: {OUTPUT_DIR}")

if __name__ == "__main__":
    main()