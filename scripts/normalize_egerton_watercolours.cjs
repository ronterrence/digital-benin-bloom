const fs = require("fs");
const path = require("path");

const inputPath = path.join(__dirname, "..", "data", "raw", "oxford_egerton_watercolours.csv");
const outputPath = path.join(__dirname, "..", "data", "normalized", "oxford_egerton_watercolours_clean.csv");

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

function normalizeRow(row) {
  return {
    image_file: (row.image_file || "").trim(),
    title: (row.title || "").trim(),
    caption: (row.caption || "").trim(),
    person_name: (row.person_name || "").trim() || "George Le Clerc Egerton",
    related_section: (row.related_section || "").trim() || "2.2",
    appendix: (row.appendix || "").trim(),
    source_page: (row.source_page || "").trim(),
    notes: (row.notes || "").trim(),
  };
}

function dedupe(rows) {
  const seen = new Set();
  return rows.filter((row) => {
    const key = [row.image_file, row.title, row.source_page].join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function toCSV(rows) {
  const headers = [
    "image_file",
    "title",
    "caption",
    "person_name",
    "related_section",
    "appendix",
    "source_page",
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
    .filter((row) => row.image_file);

  const deduped = dedupe(normalized);
  const csv = toCSV(deduped);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, csv, "utf8");

  console.log(`Normalized ${deduped.length} Egerton watercolour rows.`);
  console.log(`Saved to: ${outputPath}`);
}

main();