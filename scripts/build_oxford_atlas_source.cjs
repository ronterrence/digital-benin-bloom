const fs = require("fs");
const path = require("path");

const inputPath = path.join(
  __dirname,
  "..",
  "data",
  "normalized",
  "oxford_master_objects.csv"
);

const outputJsonPath = path.join(
  __dirname,
  "..",
  "data",
  "normalized",
  "oxford_atlas_source.json"
);

const outputTsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "oxfordAtlasSource.ts"
);

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((cell) => cell !== "")) rows.push(row);
      row = [];
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  if (!rows.length) return [];

  const headers = rows[0].map((h, i) => {
    const cleaned = h.trim();
    return i === 0 ? cleaned.replace(/^\uFEFF/, "") : cleaned;
  });

  return rows.slice(1).map((values) => {
    const obj = {};
    headers.forEach((header, idx) => {
      obj[header] = (values[idx] ?? "").trim();
    });
    return obj;
  });
}

function toBool(value) {
  return String(value).trim().toLowerCase() === "true";
}

function buildAtlasRow(row) {
  const accessionNumber = row.accession_number || "";
  const title = row.title || "";
  const description = row.description || "";
  const section = row.section || "";
  const sourcePage = row.description_source_page || row.image_source_page || "";
  const imageFile = row.primary_image_file || "";
  const imageStatus = row.image_status || "";
  const provenance = row.provenance || "";
  const provenanceDetail = row.provenance_detail || "";
  const publicationNotes = row.publication_notes || "";
  const beninStatus = row.status || "";
  const hasDescription = toBool(row.has_description);
  const hasImage = toBool(row.has_image);
  const matched = toBool(row.matched);

  return {
    sourceInstitution: "Pitt Rivers Museum / University of Oxford",
    sourceDataset: "Oxford Benin Interim Report",
    accessionNumber,
    objectTitle: title || null,
    objectDescription: description || null,
    sourceSection: section || null,
    sourcePage: sourcePage ? Number(sourcePage) || sourcePage : null,
    imageFile: imageFile || null,
    imageStatus: imageStatus || null,
    provenance: provenance || null,
    provenanceDetail: provenanceDetail || null,
    publicationNotes: publicationNotes || null,
    benin1897Status: beninStatus || null,
    hasDescription,
    hasImage,
    matched,
  };
}

function main() {
  if (!fs.existsSync(inputPath)) {
    console.error(`Missing file: ${inputPath}`);
    process.exit(1);
  }

  const rows = parseCSV(fs.readFileSync(inputPath, "utf8"));
  const atlasRows = rows.map(buildAtlasRow);

  fs.mkdirSync(path.dirname(outputJsonPath), { recursive: true });
  fs.mkdirSync(path.dirname(outputTsPath), { recursive: true });

  fs.writeFileSync(outputJsonPath, JSON.stringify(atlasRows, null, 2), "utf8");

const ts =
  `export interface OxfordAtlasSourceRow {
  sourceInstitution: string;
  sourceDataset: string;
  accessionNumber: string;
  objectTitle: string | null;
  objectDescription: string | null;
  sourceSection: string | null;
  sourcePage: number | string | null;
  imageFile: string | null;
  imageStatus: string | null;
  provenance: string | null;
  provenanceDetail: string | null;
  publicationNotes: string | null;
  benin1897Status: string | null;
  hasDescription: boolean;
  hasImage: boolean;
  matched: boolean;
}

// Import the data from the JSON file
  JSON.stringify(atlasRows, null, 2) +
export const oxfordAtlasSource: OxfordAtlasSourceRow[] = oxfordAtlasSourceJson as OxfordAtlasSourceRow[];
`;

fs.writeFileSync(outputTsPath, ts, "utf8");

console.log("=== Oxford Atlas Source Built ===");
console.log("Rows: " + atlasRows.length);
console.log("Saved JSON: " + outputJsonPath);
console.log(`Saved TS: ${outputTsPath}`);
}

main();