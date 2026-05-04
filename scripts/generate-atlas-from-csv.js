const fs = require("fs");
const path = require("path");

const enrichedPath = path.join(__dirname, "..", "final_benin_dataset_enriched.csv");
const descPath = path.join(__dirname, "..", "atlas_accession_descriptions.csv");
const outputPath = path.join(__dirname, "..", "src", "data", "atlas.ts");

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

      if (row.some((cell) => cell !== "")) {
        rows.push(row);
      }
      row = [];
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  if (rows.length === 0) return [];

  const headers = rows[0].map((h) => h.trim());
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

function toNumberOrNull(value) {
  if (value === "" || value == null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function escapeTS(value) {
  if (value == null) return "null";
  return JSON.stringify(String(value));
}

function normalizeId(imageFile) {
  if (!imageFile) return null;

  // page_116.png -> fig_116
  const m = String(imageFile).match(/page[_-](\d+)/i);
  if (m) {
    return `fig_${m[1].padStart(3, "0")}`;
  }

  // fig_116.jpg -> fig_116
  const m2 = String(imageFile).match(/(fig[_-]\d+)/i);
  if (m2) {
    return m2[1].toLowerCase().replace("-", "_");
  }

  return null;
}

function mergeDescriptions(enrichedRows, descRows) {
  const descMap = new Map();

  for (const row of descRows) {
    const accession = row.accession_number?.trim();
    const description = row.description?.trim();
    if (accession && description) {
      descMap.set(accession, description);
    }
  }

  return enrichedRows.map((row) => {
    const description = row.description?.trim();
    if (description) return row;

    const accession = row.accession_number?.trim();
    if (accession && descMap.has(accession)) {
      return { ...row, description: descMap.get(accession) };
    }

    return row;
  });
}

function buildAtlasEntries(rows) {
  const seenIds = new Set();
  const entries = [];

  for (const row of rows) {
    const id = normalizeId(row.image_file);
    if (!id) continue;
    if (seenIds.has(id)) continue;

    const accession = row.accession_number || null;
    const title = row.title || null;
    const description = row.description || null;
    const provenance = row.provenance || null;
    const section = row.section || null;
    const imageFile = row.image_file || null;
    const pageNumber = toNumberOrNull(row.page_number);
    const hasDescription = toBool(row.has_description);
    const hasProvenance = toBool(row.has_provenance);
    const hasSection = toBool(row.has_section);
    const hasImage = toBool(row.has_image);
    const dataQuality = toNumberOrNull(row.data_quality) ?? 0;

    entries.push({
      id,
      accession,
      title,
      description,
      provenance,
      section,
      imageFile,
      pageNumber,
      hasDescription,
      hasProvenance,
      hasSection,
      hasImage,
      dataQuality,
    });

    seenIds.add(id);
  }

  return entries.sort((a, b) => a.id.localeCompare(b.id));
}

function renderAtlasTS(entries) {
  const lines = [];

  lines.push(`export interface AtlasEntry {`);
  lines.push(`  id: string;`);
  lines.push(`  accessionNumber: string | null;`);
  lines.push(`  title: string | null;`);
  lines.push(`  description: string | null;`);
  lines.push(`  provenance: string | null;`);
  lines.push(`  section: string | null;`);
  lines.push(`  imageFile: string | null;`);
  lines.push(`  pageNumber: number | null;`);
  lines.push(`  hasDescription: boolean;`);
  lines.push(`  hasProvenance: boolean;`);
  lines.push(`  hasSection: boolean;`);
  lines.push(`  hasImage: boolean;`);
  lines.push(`  dataQuality: number;`);
  lines.push(`}`);
  lines.push("");
  lines.push(`export const atlas: AtlasEntry[] = [`);

  for (const entry of entries) {
    lines.push(`  {`);
    lines.push(`    id: ${escapeTS(entry.id)},`);
    lines.push(`    accessionNumber: ${escapeTS(entry.accession)},`);
    lines.push(`    title: ${escapeTS(entry.title)},`);
    lines.push(`    description: ${escapeTS(entry.description)},`);
    lines.push(`    provenance: ${escapeTS(entry.provenance)},`);
    lines.push(`    section: ${escapeTS(entry.section)},`);
    lines.push(`    imageFile: ${escapeTS(entry.imageFile)},`);
    lines.push(`    pageNumber: ${entry.pageNumber === null ? "null" : entry.pageNumber},`);
    lines.push(`    hasDescription: ${entry.hasDescription},`);
    lines.push(`    hasProvenance: ${entry.hasProvenance},`);
    lines.push(`    hasSection: ${entry.hasSection},`);
    lines.push(`    hasImage: ${entry.hasImage},`);
    lines.push(`    dataQuality: ${entry.dataQuality},`);
    lines.push(`  },`);
  }

  lines.push(`];`);
  lines.push("");

  return lines.join("\n");
}

function main() {
  const enrichedText = fs.readFileSync(enrichedPath, "utf8");
  const descText = fs.readFileSync(descPath, "utf8");

  const enrichedRows = parseCSV(enrichedText);
  const descRows = parseCSV(descText);
  const mergedRows = mergeDescriptions(enrichedRows, descRows);
  const entries = buildAtlasEntries(mergedRows);
  const output = renderAtlasTS(entries);

  fs.writeFileSync(outputPath, output, "utf8");

  console.log(`Generated atlas.ts with ${entries.length} entries.`);
  console.log(`Output: ${outputPath}`);
}

main();