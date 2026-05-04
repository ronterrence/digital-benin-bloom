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

function splitAccessionField(value) {
  if (!value) return [];
  return value
    .split("|")
    .map((v) => v.trim())
    .filter(Boolean);
}

function uniq(arr) {
  return [...new Set(arr)];
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

  const descriptionAccessions = uniq(
    descriptions
      .map((row) => (row.accession_number || "").trim())
      .filter(Boolean)
  );

  const imageAccessions = uniq(
    artifactImages.flatMap((row) => splitAccessionField(row.accession_number))
  );

  const descriptionSet = new Set(descriptionAccessions);
  const imageSet = new Set(imageAccessions);

  const matched = descriptionAccessions.filter((a) => imageSet.has(a));
  const descriptionsWithoutImages = descriptionAccessions.filter(
    (a) => !imageSet.has(a)
  );
  const imagesWithoutDescriptions = imageAccessions.filter(
    (a) => !descriptionSet.has(a)
  );

  console.log("=== Description / Image Link Audit ===");
  console.log(`Descriptions rows: ${descriptions.length}`);
  console.log(`Artifact image rows: ${artifactImages.length}`);
  console.log(`Unique description accession numbers: ${descriptionAccessions.length}`);
  console.log(`Unique image accession numbers: ${imageAccessions.length}`);
  console.log(`Matched accession numbers: ${matched.length}`);
  console.log(`Descriptions without images: ${descriptionsWithoutImages.length}`);
  console.log(`Images without descriptions: ${imagesWithoutDescriptions.length}`);

  console.log("\n--- Sample: Descriptions without images (first 20) ---");
  descriptionsWithoutImages.slice(0, 20).forEach((a) => console.log(a));

  console.log("\n--- Sample: Images without descriptions (first 20) ---");
  imagesWithoutDescriptions.slice(0, 20).forEach((a) => console.log(a));

  const report = {
    generated_at: new Date().toISOString(),
    descriptions_rows: descriptions.length,
    artifact_image_rows: artifactImages.length,
    unique_description_accessions: descriptionAccessions.length,
    unique_image_accessions: imageAccessions.length,
    matched_accessions: matched.length,
    descriptions_without_images: descriptionsWithoutImages,
    images_without_descriptions: imagesWithoutDescriptions,
  };

  const outputPath = path.join(
    __dirname,
    "..",
    "data",
    "normalized",
    "description_image_audit.json"
  );

  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), "utf8");
  console.log(`\nSaved audit JSON to: ${outputPath}`);
}

main();