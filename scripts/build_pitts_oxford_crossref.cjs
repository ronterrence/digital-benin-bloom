const fs = require("fs");
const path = require("path");
const vm = require("vm");

const atlasPath = path.join(__dirname, "..", "src", "data", "atlas.ts");
const verifiedPath = path.join(__dirname, "..", "src", "data", "verifiedMatches.ts");
const linksPath = path.join(__dirname, "..", "src", "data", "atlasOxfordLinks.ts");
const oxfordSourcePath = path.join(
  __dirname,
  "..",
  "data",
  "normalized",
  "oxford_atlas_source.json"
);

const outputDir = path.join(
  __dirname,
  "..",
  "data",
  "normalized",
  "subsets"
);

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

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function main() {
  const atlas = extractExportedArray(atlasPath, "atlas");
  const verifiedMatches = extractExportedArray(verifiedPath, "verifiedMatches");
  const atlasOxfordLinks = extractExportedArray(linksPath, "atlasOxfordLinks");
  const oxfordSource = readJson(oxfordSourcePath);

  const atlasMap = new Map(atlas.map((row) => [row.id, row]));
  const verifiedMap = new Map(verifiedMatches.map((row) => [row.id, row]));
  const linkMap = new Map(atlasOxfordLinks.map((row) => [row.artifactId, row]));
  const oxfordMap = new Map(oxfordSource.map((row) => [row.accessionNumber, row]));

  const artifactIds = Array.from(
    new Set([
      ...atlas.map((row) => row.id),
      ...verifiedMatches.map((row) => row.id),
      ...atlasOxfordLinks.map((row) => row.artifactId),
    ])
  ).sort();

  const crossref = artifactIds.map((artifactId) => {
    const atlasEntry = atlasMap.get(artifactId) || null;
    const verified = verifiedMap.get(artifactId) || null;
    const link = linkMap.get(artifactId) || null;
    const oxfordRecord =
      link?.accessionNumber && oxfordMap.has(link.accessionNumber)
        ? oxfordMap.get(link.accessionNumber)
        : null;

    const hasLegacyPageLink = !!atlasEntry;
    const hasVerifiedInterpretation = !!verified;
    const hasAccessionLink = !!(link && link.accessionNumber);
    const hasResolvedOxfordRecord = !!oxfordRecord;

    let crossrefStatus = "page_link_only";
    if (hasVerifiedInterpretation && !hasAccessionLink) {
      crossrefStatus = "verified_interpretation_only";
    }
    if (hasAccessionLink && !hasResolvedOxfordRecord) {
      crossrefStatus = "accession_link_unresolved";
    }
    if (hasAccessionLink && hasResolvedOxfordRecord) {
      crossrefStatus =
        verified?.verificationStatus === "exact"
          ? "confirmed_accession_link"
          : "probable_accession_link";
    }

    return {
      artifactId,
      crossrefStatus,

      legacyPageLink: hasLegacyPageLink
        ? {
            accessionNumber: atlasEntry.accessionNumber || null,
            pageNumber: atlasEntry.pageNumber ?? null,
            section: atlasEntry.section || null,
            title: atlasEntry.title || null,
            description: atlasEntry.description || null,
            provenance: atlasEntry.provenance || null,
          }
        : null,

      verifiedInterpretation: hasVerifiedInterpretation
        ? {
            verificationStatus: verified.verificationStatus,
            verifiedTitle: verified.verifiedTitle,
            verifiedDescription: verified.verifiedDescription || null,
            note: verified.note || null,
          }
        : null,

      accessionLink: link
        ? {
            accessionNumber: link.accessionNumber || null,
            linkType: link.linkType,
            note: link.note || null,
          }
        : null,

      oxfordRecord: oxfordRecord
        ? {
            accessionNumber: oxfordRecord.accessionNumber,
            objectTitle: oxfordRecord.objectTitle || null,
            objectDescription: oxfordRecord.objectDescription || null,
            sourceSection: oxfordRecord.sourceSection || null,
            sourcePage: oxfordRecord.sourcePage ?? null,
            imageFile: oxfordRecord.imageFile || null,
            imageStatus: oxfordRecord.imageStatus || null,
            provenance: oxfordRecord.provenance || null,
            benin1897Status: oxfordRecord.benin1897Status || null,
          }
        : null,
    };
  });

  fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, "pitts_oxford_crossref.json");
  writeJson(outputPath, crossref);

  console.log("=== Pitts ↔ Oxford cross-reference built ===");
  console.log("Cross-reference rows: " + crossref.length);
  console.log(
    "Page-linked only: " +
      crossref.filter((r) => r.crossrefStatus === "page_link_only").length
  );
  console.log(
    "Verified interpretation only: " +
      crossref.filter((r) => r.crossrefStatus === "verified_interpretation_only").length
  );
  console.log(
    "Accession link unresolved: " +
      crossref.filter((r) => r.crossrefStatus === "accession_link_unresolved").length
  );
  console.log(
    "Probable accession link: " +
      crossref.filter((r) => r.crossrefStatus === "probable_accession_link").length
  );
  console.log(
    "Confirmed accession link: " +
      crossref.filter((r) => r.crossrefStatus === "confirmed_accession_link").length
  );
  console.log("Saved to: " + outputPath);
}

main();