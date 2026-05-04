const fs = require("fs");
const path = require("path");

const descriptionsPath = path.join(
  __dirname,
  "..",
  "data",
  "normalized",
  "oxford_descriptions_clean.csv"
);

const artifactImagesPath = path.join(
  __dirname,
  "..",
  "data",
  "normalized",
  "oxford_artifact_images_clean.csv"
);

const outputCsvPath = path.join(
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
  "oxford_master_objects.json"
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

function csvEscape(value) {
  const str = value == null ? "" : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function splitAccessionField(value) {
  if (!value) return [];
  return value
    .split("|")
    .map((v) => v.trim())
    .filter(Boolean);
}

function uniqueBy(arr, keyFn) {
  const seen = new Set();
  return arr.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function main() {
  if (!fs.existsSync(descriptionsPath)) {
    console.error(`Missing file: ${descriptionsPath}`);
    process.exit(1);
  }

  if (!fs.existsSync(artifactImagesPath)) {
    console.error(`Missing file: ${artifactImagesPath}`);
    process.exit(1);
  }

  const descriptions = parseCSV(fs.readFileSync(descriptionsPath, "utf8"));
  const artifactImages = parseCSV(fs.readFileSync(artifactImagesPath, "utf8"));

  const descriptionMap = new Map();
  for (const row of descriptions) {
    const accession = (row.accession_number || "").trim();
    if (!accession) continue;
    if (!descriptionMap.has(accession)) {
      descriptionMap.set(accession, row);
    }
  }

  const imageMap = new Map();
  for (const row of artifactImages) {
    const accessions = splitAccessionField(row.accession_number);
    for (const accession of accessions) {
      const arr = imageMap.get(accession) || [];
      arr.push(row);
      imageMap.set(accession, arr);
    }
  }

  const allAccessions = Array.from(
    new Set([
      ...Array.from(descriptionMap.keys()),
      ...Array.from(imageMap.keys()),
    ])
  ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const masterRows = allAccessions.map((accession) => {
    const desc = descriptionMap.get(accession) || null;
    const images = imageMap.get(accession) || [];
    const uniqueImages = uniqueBy(images, (img) =>
      [img.image_file, img.caption, img.source_page].join("|")
    );

    const firstImage = uniqueImages[0] || null;

    return {
      accession_number: accession,
      title: desc?.title || "",
      description: desc?.description || "",
      provenance: desc?.provenance || "",
      provenance_detail: desc?.provenance_detail || "",
      section: desc?.section || firstImage?.section || "",
      publication_notes: desc?.publication_notes || "",
      status: desc?.status || "",
      description_source_page: desc?.source_page || "",
      primary_image_file: firstImage?.image_file || "",
      primary_image_caption: firstImage?.caption || "",
      image_appendix: firstImage?.appendix || "",
      image_source_page: firstImage?.source_page || "",
      image_status: firstImage?.image_status || "",
      image_count: uniqueImages.length,
      has_description: !!desc,
      has_image: uniqueImages.some((img) => (img.image_file || "").trim() !== ""),
      matched: !!desc && uniqueImages.length > 0,
    };
  });

  const headers = [
    "accession_number",
    "title",
    "description",
    "provenance",
    "provenance_detail",
    "section",
    "publication_notes",
    "status",
    "description_source_page",
    "primary_image_file",
    "primary_image_caption",
    "image_appendix",
    "image_source_page",
    "image_status",
    "image_count",
    "has_description",
    "has_image",
    "matched",
  ];

  const csvLines = [headers.join(",")];
  for (const row of masterRows) {
    csvLines.push(headers.map((h) => csvEscape(row[h])).join(","));
  }

  fs.mkdirSync(path.dirname(outputCsvPath), { recursive: true });
  fs.writeFileSync(outputCsvPath, csvLines.join("\n"), "utf8");
  fs.writeFileSync(outputJsonPath, JSON.stringify(masterRows, null, 2), "utf8");

  const matchedCount = masterRows.filter((r) => r.matched).length;
  const descOnlyCount = masterRows.filter((r) => r.has_description && !r.has_image).length;
  const imageOnlyCount = masterRows.filter((r) => !r.has_description && r.has_image).length;

  console.log("=== Master Object Table Built ===");
  console.log(`Total master rows: ${masterRows.length}`);
  console.log(`Matched rows: ${matchedCount}`);
  console.log(`Description-only rows: ${descOnlyCount}`);
  console.log(`Image-only rows: ${imageOnlyCount}`);
  console.log(`Saved CSV: ${outputCsvPath}`);
  console.log(`Saved JSON: ${outputJsonPath}`);
}

main();