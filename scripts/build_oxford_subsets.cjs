const fs = require("fs");
const path = require("path");

const inputPath = path.join(
  __dirname,
  "..",
  "data",
  "normalized",
  "oxford_master_objects.json"
);

const outputDir = path.join(
  __dirname,
  "..",
  "data",
  "normalized",
  "subsets"
);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function main() {
  if (!fs.existsSync(inputPath)) {
    console.error("Missing input: " + inputPath);
    process.exit(1);
  }

  const rows = readJson(inputPath);

  const oxford_holdings_all = rows;

  const oxford_holdings_with_images = rows.filter(
    (row) =>
      row.has_image === true &&
      row.image_status &&
      row.image_status !== "no_image" &&
      row.image_status !== "missing" &&
      row.primary_image_file
  );

  const oxford_holdings_description_only = rows.filter(
    (row) => row.has_description === true && row.has_image === false
  );

  const oxford_holdings_no_image_placeholders = rows.filter(
    (row) =>
      row.image_status === "no_image" ||
      row.image_status === "missing"
  );

  fs.mkdirSync(outputDir, { recursive: true });

  writeJson(
    path.join(outputDir, "oxford_holdings_all.json"),
    oxford_holdings_all
  );

  writeJson(
    path.join(outputDir, "oxford_holdings_with_images.json"),
    oxford_holdings_with_images
  );

  writeJson(
    path.join(outputDir, "oxford_holdings_description_only.json"),
    oxford_holdings_description_only
  );

  writeJson(
    path.join(outputDir, "oxford_holdings_no_image_placeholders.json"),
    oxford_holdings_no_image_placeholders
  );

  console.log("=== Oxford subsets built ===");
  console.log("All holdings: " + oxford_holdings_all.length);
  console.log("Holdings with usable images: " + oxford_holdings_with_images.length);
  console.log("Description-only holdings: " + oxford_holdings_description_only.length);
  console.log("No-image placeholders: " + oxford_holdings_no_image_placeholders.length);
  console.log("Saved to: " + outputDir);
}

main();