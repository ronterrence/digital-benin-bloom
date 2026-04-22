export interface VerifiedMatch {
  id: string;
  verificationStatus: "exact" | "probable";
  verifiedTitle: string;
  verifiedDescription?: string;
  note?: string;
}

export const verifiedMatches: VerifiedMatch[] = [
  {
    id: "fig_090",
    verificationStatus: "probable",
    verifiedTitle: "Standing bronze human figure",
    verifiedDescription:
      "Pair of standing bronze figures shown in the Pitt Rivers plate.",
    note:
      "Oxford page-linked catalog record is present, but the extracted title/description does not appear to describe the depicted object accurately.",
  },
  {
    id: "fig_116",
    verificationStatus: "probable",
    verifiedTitle: "Bronze mancala stand",
    verifiedDescription:
      "Bronze stand for the game of mancala, with ten holes.",
    note:
      "Page-linked Oxford catalog record appears misaligned with the depicted object.",
  },
  {
    id: "fig_132",
    verificationStatus: "probable",
    verifiedTitle: "Carved head / head-like object",
    verifiedDescription:
      "Object-level identity needs confirmation; current page-linked catalog title should not be treated as exact.",
    note:
      "Keep Oxford page link, but do not present the catalog title as a verified object match.",
  },
];