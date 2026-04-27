const fs = require("fs");
const path = require("path");

const inputPath = path.join(__dirname, "..", "data", "raw", "oxford_artifact_images.csv");
const outputPath = path.join(__dirname, "..", "data", "normalized", "oxford_artifact_images_clean.csv");

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

function normalizeImageStatus(value) {
  const v = (value || "").trim().toLowerCase();

  if (v === "available") return "available";
  if (v === "missing") return "missing";
  if (v === "no_image") return "no_image";
  return v || "available";
}

function normalizeAppendix(value) {
  const v = (value || "").trim();
  const allowed = new Set(["Appendix 3", "Appendix 4", "Appendix 5"]);
  return allowed.has(v) ? v : v || "";
}

function normalizeSection(value) {
  return (value || "").trim();
}

function normalizeAccession(value) {
  return (value || "").trim();
}

function normalizeRow(row) {
  return {
    accession_number: normalizeAccession(row.accession_number),
    image_file: (row.image_file || "").trim(),
    caption: (row.caption || "").trim(),
    section: normalizeSection(row.section),
    appendix: normalizeAppendix(row.appendix),
    source_page: (row.source_page || "").trim(),
    image_status: normalizeImageStatus(row.image_status),
    notes: (row.notes || "").trim(),
  };
}

function dedupe(rows) {
  const seen = new Set();

  return rows.filter((row) => {
    const key = [
      row.accession_number,
      row.image_file,
      row.caption,
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
    "image_file",
    "caption",
    "section",
    "appendix",
    "source_page",
    "image_status",
    "notes",
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
    .filter((row) => row.accession_number || row.image_file);

  const deduped = dedupe(normalized);
  const csv = toCSV(deduped);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, csv, "utf8");

  console.log(`Normalized ${deduped.length} artifact-image rows.`);
  console.log(`Saved to: ${outputPath}`);
}

main();