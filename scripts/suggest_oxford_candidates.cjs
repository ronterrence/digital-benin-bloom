const fs = require("fs");
const path = require("path");
const vm = require("vm");

const artifactsPath = path.join(__dirname, "..", "src", "data", "artifacts.ts");
const oxfordMasterPath = path.join(
  __dirname,
  "..",
  "data",
  "normalized",
  "oxford_master_objects.json"
);

const outputDir = path.join(__dirname, "..", "data", "normalized", "subsets");
const outputJsonPath = path.join(outputDir, "pitts_oxford_candidate_suggestions.json");
const outputCsvPath = path.join(outputDir, "pitts_oxford_candidate_suggestions.csv");

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function extractExportedArray(filePath, varName) {
  const text = readText(filePath);
  const pattern = new RegExp(
    `export\\s+const\\s+${varName}(?:\\s*:[^=]+)?\\s*=\\s*(\\[[\\s\\S]*?\\]);`,
    "m"
  );
  const match = text.match(pattern);
  if (!match) {
    throw new Error(`Could not find exported array "${varName}" in ${filePath}`);
  }
  return vm.runInNewContext(match[1], {});
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsPhrase(text, phrase) {
  return normalizeText(text).includes(normalizeText(phrase));
}

const MATERIALS = [
  "bronze",
  "brass",
  "ivory",
  "wood",
  "wooden",
  "terracotta",
  "copper",
  "iron",
  "coral",
  "agate",
];

const OBJECT_PATTERNS = [
  { key: "mancala stand", phrases: ["mancala stand", "game of mancala"] },
  { key: "head", phrases: ["bronze head", "head of girl", "head of boy", "commemorative head", "head"] },
  { key: "plaque", phrases: ["plaque"] },
  { key: "figure", phrases: ["human figure", "standing figure", "carved figure", "figure"] },
  { key: "mask", phrases: ["hip ornament mask", "mask"] },
  { key: "armlet", phrases: ["armlet"] },
  { key: "bell", phrases: ["bell", "pellet bell"] },
  { key: "trumpet", phrases: ["trumpet", "side blown", "side-blown"] },
  { key: "staff", phrases: ["staff"] },
  { key: "sword", phrases: ["sword"] },
  { key: "bowl", phrases: ["bowl"] },
  { key: "vessel", phrases: ["vessel", "casket"] },
  { key: "bracelet", phrases: ["bracelet", "anklet", "leg ring", "arm ring", "arm-ring"] },
];

const FEATURE_PATTERNS = [
  "girl",
  "boy",
  "female",
  "male",
  "warrior",
  "king",
  "horse",
  "rider",
  "tribal marks",
  "inlaid",
  "eyes",
  "necklace",
  "neck rings",
  "coiffure",
  "coral",
  "agate",
  "staff",
  "sword",
  "spear",
  "shield",
  "ten holes",
  "holes",
  "pair",
  "group",
  "standing",
  "three views",
  "side view",
];

function extractSignals(text) {
  const normalized = normalizeText(text);

  const materials = MATERIALS.filter((m) => normalized.includes(normalizeText(m))).map((m) =>
    m === "wooden" ? "wood" : m
  );

  let primaryType = null;
  const objectTypes = [];
  for (const pattern of OBJECT_PATTERNS) {
    if (pattern.phrases.some((phrase) => normalized.includes(normalizeText(phrase)))) {
      objectTypes.push(pattern.key);
      if (!primaryType) primaryType = pattern.key;
    }
  }

  const features = FEATURE_PATTERNS.filter((f) => normalized.includes(normalizeText(f)));

  return {
    normalized,
    materials: [...new Set(materials)],
    objectTypes: [...new Set(objectTypes)],
    primaryType,
    features: [...new Set(features)],
  };
}

function buildPittsRecord(artifact) {
  const description = artifact.description || "";
  return {
    artifactId: artifact.id,
    cluster: artifact.cluster,
    description,
    signals: extractSignals(description),
  };
}

function buildOxfordRecord(row) {
  const description = row.description || row.title || "";
  return {
    accessionNumber: row.accession_number || "",
    description,
    title: row.title || "",
    section: row.section || "",
    imageFile: row.primary_image_file || "",
    hasImage: row.has_image === true,
    imageStatus: row.image_status || "",
    status: row.status || "",
    signals: extractSignals(description),
  };
}

function scoreCandidate(pitts, oxford) {
  let score = 0;
  const reasons = [];

  const p = pitts.signals;
  const o = oxford.signals;

  const sharedMaterials = p.materials.filter((m) => o.materials.includes(m));
  if (sharedMaterials.length) {
    score += 4;
    reasons.push(`matched material: ${sharedMaterials.join(", ")}`);
  }

  if (p.primaryType && o.objectTypes.includes(p.primaryType)) {
    score += 6;
    reasons.push(`matched object type: ${p.primaryType}`);
  } else if (p.primaryType && o.primaryType && p.primaryType !== o.primaryType) {
    score -= 4;
    reasons.push(`object-type mismatch: ${p.primaryType} vs ${o.primaryType}`);
  }

  const sharedFeatures = p.features.filter((f) => o.features.includes(f));
  if (sharedFeatures.length) {
    const bonus = Math.min(sharedFeatures.length, 4);
    score += bonus;
    reasons.push(`matched features: ${sharedFeatures.slice(0, 4).join(", ")}`);
  }

  if (containsPhrase(pitts.description, "bronze head") && containsPhrase(oxford.description, "bronze head")) {
    score += 3;
    reasons.push("exact phrase family: bronze head");
  }

  if (containsPhrase(pitts.description, "mancala") && containsPhrase(oxford.description, "mancala")) {
    score += 5;
    reasons.push("exact phrase family: mancala");
  }

  if (containsPhrase(pitts.description, "pair") && !containsPhrase(oxford.description, "pair")) {
    score -= 1;
    reasons.push("possible composition mismatch: pair vs single/unspecified");
  }

  if (oxford.hasImage && oxford.imageStatus === "available") {
    score += 1;
    reasons.push("Oxford image available");
  }

  if (oxford.status === "confirmed_1897") {
    score += 1;
    reasons.push("Oxford record marked confirmed_1897");
  }

  const hasStrongOverlap =
    sharedMaterials.length > 0 ||
    (p.primaryType && o.objectTypes.includes(p.primaryType)) ||
    sharedFeatures.length > 0 ||
    score >= 6;

  return {
    score,
    reasons,
    hasStrongOverlap,
  };
}

function csvEscape(value) {
  const str = value == null ? "" : String(value);
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

function main() {
  if (!fs.existsSync(artifactsPath)) {
    throw new Error("Missing artifacts.ts");
  }
  if (!fs.existsSync(oxfordMasterPath)) {
    throw new Error("Missing oxford_master_objects.json");
  }

  const artifacts = extractExportedArray(artifactsPath, "artifacts");
  const oxfordRows = readJson(oxfordMasterPath);

  const pittsRecords = artifacts.map(buildPittsRecord);
  const oxfordRecords = oxfordRows
    .filter((row) => row.accession_number && (row.description || row.title))
    .map(buildOxfordRecord);

  const suggestions = pittsRecords.map((pitts) => {
    const candidates = oxfordRecords
      .map((oxford) => {
        const scored = scoreCandidate(pitts, oxford);
        return {
          accessionNumber: oxford.accessionNumber,
          description: oxford.description,
          section: oxford.section || null,
          imageFile: oxford.imageFile || null,
          imageStatus: oxford.imageStatus || null,
          oxfordStatus: oxford.status || null,
          score: scored.score,
          reasons: scored.reasons,
          hasStrongOverlap: scored.hasStrongOverlap,
        };
      })
      .filter((c) => c.hasStrongOverlap && c.score >= 4)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    return {
      artifactId: pitts.artifactId,
      cluster: pitts.cluster,
      pittsDescription: pitts.description,
      extractedSignals: pitts.signals,
      candidates,
    };
  });

  const withCandidates = suggestions.filter((row) => row.candidates.length > 0);

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputJsonPath, JSON.stringify(withCandidates, null, 2), "utf8");

  const csvLines = [
    [
      "artifact_id",
      "cluster",
      "rank",
      "accession_number",
      "score",
      "pitts_description",
      "oxford_description",
      "section",
      "image_file",
      "reasons",
    ].join(","),
  ];

  for (const row of withCandidates) {
    row.candidates.forEach((candidate, index) => {
      csvLines.push([
        csvEscape(row.artifactId),
        csvEscape(row.cluster),
        csvEscape(index + 1),
        csvEscape(candidate.accessionNumber),
        csvEscape(candidate.score),
        csvEscape(row.pittsDescription),
        csvEscape(candidate.description),
        csvEscape(candidate.section || ""),
        csvEscape(candidate.imageFile || ""),
        csvEscape(candidate.reasons.join(" | ")),
      ].join(","));
    });
  }

  fs.writeFileSync(outputCsvPath, csvLines.join("\n"), "utf8");

  console.log("=== Oxford candidate suggestions built ===");
  console.log("Pitts artifacts scanned: " + pittsRecords.length);
  console.log("Oxford records scanned: " + oxfordRecords.length);
  console.log("Pitts artifacts with at least one candidate: " + withCandidates.length);
  console.log("Saved JSON: " + outputJsonPath);
  console.log("Saved CSV: " + outputCsvPath);
}

main();