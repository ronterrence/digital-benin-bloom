import json
import sys
from pathlib import Path

from openpyxl import Workbook

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from import_atlas import HEADERS, import_atlas, make_record  # noqa: E402


def row(**values):
    defaults = {header: "" for header in HEADERS}
    defaults.update({
        "Batch": "1", "Country": "Austria", "City/Region": "Vienna",
        "Institution": "Weltmuseum Wien", "Record Level": "Object",
        "Object title": "Court figure", "Object type": "Figure",
        "Cultural attribution": "Edo, Benin Kingdom", "Date / period": "16th century",
        "Material": "Brass", "Accession / inventory number": "123",
        "Provenance summary": "Documented source", "1897 connection": "Possible 1897 context",
        "Digital Benin status/link": "Object ID not captured",
        "Current ownership/restitution status": "Current ownership needs verification",
        "Catalogue/source URL": "https://museum.example/object/123", "Image available?": "Yes",
        "Confidence level": "Confirmed", "Research priority": "High", "Notes": "Private note",
    })
    defaults.update(values)
    return defaults


def write_workbook(path: Path, rows):
    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "Master Register"
    sheet.append(HEADERS)
    for item in rows:
        sheet.append([item[header] for header in HEADERS])
    workbook.save(path)


def test_record_is_conservative_and_public_output_is_sanitized(tmp_path):
    source = tmp_path / "atlas.xlsx"
    write_workbook(source, [row()])
    report = import_atlas(source, tmp_path / "output")
    public = json.loads((tmp_path / "output" / "atlas_public_records.json").read_text("utf-8"))
    assert report["records_created"] == 1
    assert public[0]["digital_benin_match_status"] == "not_checked"
    assert public[0]["expedition_1897_status"] == "possible_1897_link"
    assert "_raw_import_payload" not in public[0]
    assert "_internal_research_notes" not in public[0]
    queue = json.loads((tmp_path / "output" / "atlas_research_queue.json").read_text("utf-8"))
    assert {task["task_type"] for task in queue} >= {"missing_digital_benin_id", "unclear_ownership", "missing_image_rights"}


def test_deterministic_shift_is_repaired_and_reported():
    shifted = row(**{
        "1897 connection": "Digital Benin IDs not captured",
        "Digital Benin status/link": "Ownership transferred to Nigeria",
        "Current ownership/restitution status": "https://museum.example/source",
        "Catalogue/source URL": "Yes", "Image available?": "Confirmed collection-level",
        "Confidence level": "High", "Research priority": "Needs follow-up", "Notes": "",
    })
    record, warnings = make_record(shifted, 16)
    assert record["museum_catalogue_url"] == "https://museum.example/source"
    assert record["digital_benin_source_text"] == "Digital Benin IDs not captured"
    assert record["expedition_1897_status"] == "unclear"
    assert any(warning["code"] == "source_columns_repaired" for warning in warnings)


def test_duplicate_accessions_are_flagged(tmp_path):
    source = tmp_path / "atlas.xlsx"
    write_workbook(source, [row(), row(**{"Object title": "Second title"})])
    report = import_atlas(source, tmp_path / "output")
    assert len(report["possible_duplicates"]) == 1
    assert report["errors"][0]["code"] == "possible_duplicate"


def test_missing_coordinates_create_research_task(tmp_path):
    source = tmp_path / "atlas.xlsx"
    write_workbook(source, [row(**{"City/Region": "Unknown city"})])
    import_atlas(source, tmp_path / "output")
    queue = json.loads((tmp_path / "output" / "atlas_research_queue.json").read_text("utf-8"))
    assert any(task["task_type"] == "missing_coordinates" for task in queue)


def test_existing_curated_values_are_preserved_when_import_is_blank(tmp_path):
    source = tmp_path / "atlas.xlsx"
    output = tmp_path / "output"
    write_workbook(source, [row()])
    import_atlas(source, output)
    research_path = output / "atlas_research_records.json"
    existing = json.loads(research_path.read_text("utf-8"))
    existing[0]["image_rights"] = "Museum licence"
    research_path.write_text(json.dumps(existing), encoding="utf-8")
    import_atlas(source, output)
    refreshed = json.loads(research_path.read_text("utf-8"))
    assert refreshed[0]["image_rights"] == "Museum licence"


def test_real_workbook_shape():
    output = ROOT / ".pytest-atlas-output"
    try:
        report = import_atlas(ROOT / "data" / "raw" / "benin_artefacts_master_register.xlsx", output)
        assert report["total_records"] == 45
        assert report["object_records"] == 30
        assert report["collection_records"] == 15
        assert report["warning_counts"]["source_columns_repaired"] == 2
    finally:
        if output.exists():
            for child in output.iterdir():
                child.unlink()
            output.rmdir()
