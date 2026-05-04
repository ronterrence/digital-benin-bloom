const fs = require("fs");
const path = require("path");

const inputPath = path.join(
  __dirname,
  "..",
  "data",
  "normalized",
  "oxford_atlas_source.json"
);

const query = (process.argv[2] || "").toLowerCase().trim();

if (!query) {
  console.log("Usage: node scripts/search_oxford_source.cjs <term>");
  process.exit(1);
}

const rows = JSON.parse(fs.readFileSync(inputPath, "utf8"));

const matches = rows.filter((row) => {
  return [
    row.accessionNumber,
    row.objectTitle,
    row.objectDescription,
    row.provenance,
    row.provenanceDetail,
    row.publicationNotes,
    row.sourceSection,
    row.imageFile,
  ]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(query));
});

console.log(`Matches for "${query}": ${matches.length}\n`);

matches.slice(0, 20).forEach((row) => {
  console.log("Accession:", row.accessionNumber);
  console.log("Description:", row.objectDescription || row.objectTitle || "");
  console.log("Section:", row.sourceSection || "");
  console.log("Image:", row.imageFile || "");
  console.log("Status:", row.benin1897Status || "");
  console.log("---");
});