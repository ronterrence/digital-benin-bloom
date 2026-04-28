export interface AtlasOxfordLink {
  artifactId: string;
  accessionNumber: string;
  linkType: "page_link" | "object_match" | "verified_match";
  note?: string;
}

export const atlasOxfordLinks: AtlasOxfordLink[] = [
  {
    artifactId: "fig_090",
    accessionNumber: "",
    linkType: "verified_match",
    note: "Current Oxford accession candidate rejected after visual comparison. Object-level Oxford accession not yet confirmed.",
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