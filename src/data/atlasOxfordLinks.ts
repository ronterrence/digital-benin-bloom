export interface AtlasOxfordLink {
  artifactId: string;
  accessionNumber: string;
  linkType: "page_link" | "object_match" | "verified_match";
  note?: string;
}

export const atlasOxfordLinks: AtlasOxfordLink[] = [
  // verified examples
  {
    artifactId: "fig_090",
    accessionNumber: "1992.20.1",
    linkType: "verified_match",
    note: "Probable Oxford match: standing brass figure holding staff. Needs visual confirmation.",
  },
  {
    artifactId: "fig_116",
    accessionNumber: "",
    linkType: "verified_match",
    note: "Verified interpretive label exists, but Oxford accession not yet confirmed.",
  },
  {
    artifactId: "fig_132",
    accessionNumber: "",
    linkType: "verified_match",
    note: "Verified interpretive label exists, but Oxford accession not yet confirmed.",
  },
];
