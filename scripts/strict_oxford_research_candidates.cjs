const fs = require("fs");
const path = require("path");
const vm = require("vm");

const repoRoot = path.join(__dirname, "..");
const artifactsPath = path.join(repoRoot, "src", "data", "artifacts.ts");
const oxfordPath = path.join(repoRoot, "data", "normalized", "oxford_master_objects.json");
const outputPath = path.join(repoRoot, "data", "normalized", "subsets", "strict_oxford_research_candidates.csv");

function readExportedArray(filePath, varName) {
  const text = fs.readFileSync(filePath, "utf8");
  const match = text.match(
    new RegExp(`export\\s+const\\s+${varName}(?:\\s*:[^=]+)?\\s*=\\s*(\\[[\\s\\S]*?\\]);`, "m")
  );
  if (!match) throw new Error(`Could not find ${varName} in ${filePath}`);
  return vm.runInNewContext(match[1], {});
}

function norm(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/[^a-z0-9\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function has(text, phrase) {
  return norm(text).includes(norm(phrase));
}

const TYPE_RULES = [
  { type: "plaque", phrases: ["relief plaque", "bronze plaque", "brass plaque", "rectangular bronze plaque", "plaque"] },
  { type: "head", phrases: ["commemorative head", "bronze head", "brass head", "head"] },
  { type: "mask", phrases: ["hip-ornament mask", "hip ornament mask", "pendant mask", "mask"] },
  { type: "bell", phrases: ["clapperless bell", "pellet bell", "bronze bell", "bell"] },
  { type: "armlet", phrases: ["armlet", "arm ring", "arm-ring"] },
  { type: "bracelet", phrases: ["bracelet", "anklet", "leg ring"] },
  { type: "figure", phrases: ["standing figure", "human figure", "bronze figure", "brass figure", "figure"] },
  { type: "vessel", phrases: ["cylindrical vessel", "vessel", "casket", "bowl", "cup"] },
  { type: "staff", phrases: ["staff"] },
  { type: "sword", phrases: ["sword"] },
  { type: "tusk", phrases: ["tusk", "trumpet"] },
  { type: "cylinder", phrases: ["powder cylinder", "cylinder"] },
  { type: "mancala", phrases: ["mancala"] },
  { type: "stool", phrases: ["stool"] },
  { type: "drum", phrases: ["drum"] },
];

const MATERIALS = ["bronze", "brass", "ivory", "wood", "wooden", "iron", "copper", "coral", "agate", "tortoise-shell"];
const FEATURES = [
  "serpent",
  "snake",
  "fish",
  "crocodile",
  "leopard",
  "ram",
  "horse",
  "rider",
  "warrior",
  "standing",
  "three figures",
  "two figures",
  "human figure",
  "female",
  "male",
  "boy",
  "girl",
  "bird",
  "mudfish",
  "rosette",
  "leaf-shaped sword",
  "sword",
  "shield",
  "staff",
  "coral",
  "agate",
  "mancala",
  "ten holes",
];

function firstType(text) {
  const normalized = norm(text);
  const firstWords = normalized.split(" ").slice(0, 10).join(" ");
  for (const rule of TYPE_RULES) {
    if (rule.phrases.some((phrase) => has(firstWords, phrase))) return rule.type;
  }
  for (const rule of TYPE_RULES) {
    if (rule.phrases.some((phrase) => has(normalized, phrase))) return rule.type;
  }
  return "";
}

function allTypes(text) {
  const normalized = norm(text);
  return TYPE_RULES
    .filter((rule) => rule.phrases.some((phrase) => has(normalized, phrase)))
    .map((rule) => rule.type);
}

function materialSignals(text) {
  return [...new Set(MATERIALS.filter((item) => has(text, item)).map((item) => (item === "wooden" ? "wood" : item)))];
}

function featureSignals(text) {
  return [...new Set(FEATURES.filter((item) => has(text, item)))];
}

function signals(text) {
  return {
    type: firstType(text),
    types: allTypes(text),
    materials: materialSignals(text),
    features: featureSignals(text),
  };
}

function score(left, right) {
  let value = 0;
  const reasons = [];

  if (left.type && right.type && left.type === right.type) {
    value += 20;
    reasons.push(`same primary type: ${left.type}`);
  } else if (left.type && right.types.includes(left.type)) {
    value += 12;
    reasons.push(`Oxford includes source type: ${left.type}`);
  } else if (left.type && right.type) {
    value -= 20;
    reasons.push(`type mismatch: ${left.type} vs ${right.type}`);
  }

  const sharedMaterials = left.materials.filter((item) => right.materials.includes(item));
  if (sharedMaterials.length) {
    value += sharedMaterials.length * 3;
    reasons.push(`shared material: ${sharedMaterials.join("; ")}`);
  }

  const sharedFeatures = left.features.filter((item) => right.features.includes(item));
  if (sharedFeatures.length) {
    value += sharedFeatures.length * 4;
    reasons.push(`shared feature: ${sharedFeatures.join("; ")}`);
  }

  if (!left.type || !right.type) value -= 3;

  return { value, reasons };
}

function csv(value) {
  const text = value == null ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

const artifacts = readExportedArray(artifactsPath, "artifacts");
const oxfordRows = JSON.parse(fs.readFileSync(oxfordPath, "utf8"));

const oxford = oxfordRows
  .filter((row) => row.accession_number && (row.description || row.title))
  .map((row) => {
    const text = row.description || row.title || "";
    return {
      accession: row.accession_number,
      description: text,
      imageFile: row.primary_image_file || "",
      section: row.section || "",
      status: row.status || "",
      signals: signals(text),
    };
  });

const rows = [];
for (const artifact of artifacts) {
  const sourceSignals = signals(artifact.description);
  const candidates = oxford
    .map((candidate) => {
      const result = score(sourceSignals, candidate.signals);
      return { candidate, score: result.value, reasons: result.reasons };
    })
    .filter((row) => row.score >= 18 && row.reasons.some((reason) => reason.startsWith("same primary type")))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  for (const [index, row] of candidates.entries()) {
    rows.push({
      artifactId: artifact.id,
      image: artifact.mainImage,
      rank: index + 1,
      sourceType: sourceSignals.type,
      accession: row.candidate.accession,
      score: row.score,
      oxfordType: row.candidate.signals.type,
      oxfordImage: row.candidate.imageFile,
      pittsDescription: artifact.description,
      oxfordDescription: row.candidate.description,
      reasons: row.reasons.join(" | "),
    });
  }
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
const header = [
  "artifact_id",
  "image",
  "rank",
  "source_type",
  "accession_number",
  "score",
  "oxford_type",
  "oxford_image",
  "pitts_description",
  "oxford_description",
  "reasons",
];
const lines = [header.join(",")];
for (const row of rows) {
  lines.push([
    row.artifactId,
    row.image,
    row.rank,
    row.sourceType,
    row.accession,
    row.score,
    row.oxfordType,
    row.oxfordImage,
    row.pittsDescription,
    row.oxfordDescription,
    row.reasons,
  ].map(csv).join(","));
}
fs.writeFileSync(outputPath, lines.join("\n"), "utf8");

console.log(`Artifacts scanned: ${artifacts.length}`);
console.log(`Oxford records scanned: ${oxford.length}`);
console.log(`Strict candidate rows: ${rows.length}`);
console.log(`Wrote: ${outputPath}`);
