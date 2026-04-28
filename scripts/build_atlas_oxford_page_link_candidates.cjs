const fs = require("fs");
const path = require("path");
const vm = require("vm");

const repoRoot = path.join(__dirname, "..");
const atlasPath = path.join(repoRoot, "src", "data", "atlas.ts");
const oxfordPath = path.join(repoRoot, "data", "normalized", "oxford_master_objects.json");
const outputPath = path.join(repoRoot, "data", "normalized", "subsets", "atlas_oxford_page_link_candidates.csv");

function extractExportedArray(filePath, varName) {
  const text = fs.readFileSync(filePath, "utf8");
  const match = text.match(
    new RegExp(`export\\s+const\\s+${varName}(?:\\s*:[^=]+)?\\s*=\\s*(\\[[\\s\\S]*?\\]);`, "m")
  );
  if (!match) throw new Error(`Could not find ${varName} in ${filePath}`);
  return vm.runInNewContext(match[1], {});
}

function csv(value) {
  const text = value == null ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

const atlas = extractExportedArray(atlasPath, "atlas");
const oxford = JSON.parse(fs.readFileSync(oxfordPath, "utf8"));
const oxfordByAccession = new Map(oxford.map((row) => [row.accession_number, row]));

const rows = atlas
  .filter((row) => row.id && row.accessionNumber)
  .map((row) => {
    const oxfordRow = oxfordByAccession.get(row.accessionNumber) || null;
    return {
      artifact_id: row.id,
      source_image: `${row.id}.jpg`,
      source_detail_image: `${row.id}h.jpg`,
      linked_accession_number: row.accessionNumber,
      atlas_page_image: row.imageFile || "",
      atlas_page_number: row.pageNumber ?? "",
      atlas_data_quality: row.dataQuality ?? "",
      oxford_image: oxfordRow?.primary_image_file || "",
      oxford_image_status: oxfordRow?.image_status || "",
      oxford_description: oxfordRow?.description || oxfordRow?.title || row.description || "",
      oxford_provenance: oxfordRow?.provenance || row.provenance || "",
      oxford_section: oxfordRow?.section || row.section || "",
      confidence: oxfordRow ? "page_link_resolved_to_oxford_record" : "page_link_only_unresolved",
      note: "This is not a visual match. It is the existing atlas figure-to-accession link resolved against Oxford metadata.",
    };
  });

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
const header = Object.keys(rows[0] || {});
fs.writeFileSync(
  outputPath,
  [header.join(","), ...rows.map((row) => header.map((key) => csv(row[key])).join(","))].join("\n"),
  "utf8"
);

console.log(`Atlas rows with accessions: ${rows.length}`);
console.log(`Resolved Oxford records: ${rows.filter((row) => row.oxford_image || row.oxford_description).length}`);
console.log(`Wrote: ${outputPath}`);
