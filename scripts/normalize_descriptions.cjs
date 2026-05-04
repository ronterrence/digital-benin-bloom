const fs = require("fs");
const path = require("path");

const inputPath = path.join(__dirname, "..", "data", "raw", "oxford_descriptions.csv");
const outputPath = path.join(__dirname, "..", "data", "normalized", "oxford_descriptions_clean.csv");

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

function csvEscape(value) {
  const str = value == null ? "" : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function normalizeStatus(value) {
  const v = (value || "").trim().toLowerCase();

  if (v === "confirmed_1897") return "confirmed_1897";
  if (v === "possible_1897") return "possible_1897";
  if (v === "contextual") return "contextual";

  return v || "";
}

function normalizeText(value) {
  return (value || "").trim().replace(/\s+/g, " ");
}

function normalizeSection(value) {
  return (value || "").trim();
}

function normalizeRow(row) {
  return {
    accession_number: normalizeText(row.accession_number),
    title: normalizeText(row.title),
    description: normalizeText(row.description),
    provenance: normalizeText(row.provenance),
    provenance_detail: normalizeText(row.provenance_detail),
    section: normalizeSection(row.section),
    publication_notes: normalizeText(row.publication_notes),
    status: normalizeStatus(row.status),
    source_page: normalizeText(row.source_page),
  };
}

function dedupe(rows) {
  const seen = new Set();

  return rows.filter((row) => {
    const key = [
      row.accession_number,
      row.description,
      row.section,
      row.source_page,
    ].join("|");

    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function toCSV(rows) {
  const headers = [
    "accession_number",
    "title",
    "description",
    "provenance",
    "provenance_detail",
    "section",
    "publication_notes",
    "status",
    "source_page",
  ];

  const lines = [headers.join(",")];

  for (const row of rows) {
    lines.push(headers.map((h) => csvEscape(row[h])).join(","));
  }

  return lines.join("\n");
}

function main() {
  if (!fs.existsSync(inputPath)) {
    console.error(`Input not found: ${inputPath}`);
    process.exit(1);
  }

  const text = fs.readFileSync(inputPath, "utf8").replace(/^\uFEFF/, "");
  const rows = parseCSV(text);

  console.log("Parsed rows:", rows.length);

  if (!rows.length) {
    console.error(`CSV contains headers only or no data rows: ${inputPath}`);
    process.exit(1);
  }

  const normalized = rows
    .map(normalizeRow)
    .filter((row) => row.accession_number || row.description);

  const deduped = dedupe(normalized);
  const csv = toCSV(deduped);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, csv, "utf8");

  console.log(`Normalized ${deduped.length} description rows.`);
  console.log(`Saved to: ${outputPath}`);
}

main();