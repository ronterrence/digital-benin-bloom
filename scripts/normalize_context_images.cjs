const fs = require("fs");
const path = require("path");

const inputPath = path.join(__dirname, "..", "data", "raw", "oxford_context_images.csv");
const outputPath = path.join(__dirname, "..", "data", "normalized", "oxford_context_images_clean.csv");

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

  const headers = rows[0].map((h) => h.trim());
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

function normalizeKind(value) {
  const v = (value || "").trim().toLowerCase();

  const map = {
    expedition_photo: "expedition_photo",
    watercolour: "watercolour",
    documentary_photo: "documentary_photo",
    site_view: "site_view",
    destruction_scene: "destruction_scene",
    compound_view: "compound_view",
    object_cache: "object_cache",
    group_portrait: "group_portrait",
  };

  return map[v] || "documentary_photo";
}

function normalizeSourceGroup(value) {
  const v = (value || "").trim();

  const allowed = new Set([
    "Appendix 6",
    "Appendix 7",
    "Egerton",
    "Granville",
    "Walker",
  ]);

  return allowed.has(v) ? v : v || "";
}

function normalizeRow(row) {
  return {
    image_file: (row.image_file || "").trim(),
    title: (row.title || "").trim(),
    caption: (row.caption || "").trim(),
    kind: normalizeKind(row.kind),
    source_group: normalizeSourceGroup(row.source_group),
    person_name: (row.person_name || "").trim(),
    related_section: (row.related_section || "").trim(),
    appendix: (row.appendix || "").trim(),
    source_page: (row.source_page || "").trim(),
    notes: (row.notes || "").trim(),
  };
}

function dedupe(rows) {
  const seen = new Set();
  return rows.filter((row) => {
    const key = [
      row.image_file,
      row.title,
      row.kind,
      row.source_page,
    ].join("|");

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
    "kind",
    "source_group",
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
    if (rows.length) {
    console.log("Headers:", Object.keys(rows[0]));
    console.log("First row:", rows[0]);
}
  const normalized = rows
    .map(normalizeRow)
    .filter((row) => row.image_file);

  const deduped = dedupe(normalized);
  const csv = toCSV(deduped);

  fs.writeFileSync(outputPath, csv, "utf8");

  console.log(`Normalized ${deduped.length} context-image rows.`);
  console.log(`Saved to: ${outputPath}`);
}

main();