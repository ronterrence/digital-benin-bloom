export type VerifiedMatch = {
  id: string;
  verificationStatus: "exact" | "probable" | "uncertain";

  verifiedTitle?: string;
  verifiedDescription?: string;
  note?: string;

  institution?: "Oxford" | "British Museum" | "Pitt Rivers" | "Other";
  museumRecordId?: string;
  accessionNumber?: string;
  imageFile?: string;
  museumUrl?: string;

  physicalLocation?: string;
  ownershipStatus?: string;
};

export const verifiedMatches: VerifiedMatch[] = [
  {
  id: "fig_004",
  verificationStatus: "probable",
  verifiedTitle: "Relief plaque depicting the Oba with mudfish legs and leopards",
  verifiedDescription:
    "Likely match to a British Museum plaque showing the Oba holding leopards, with mudfish suspended from the belt.",
  institution: "British Museum",
  museumRecordId: "Af1898_0115.31",
  accessionNumber: "Af1898,0115.31",
  imageFile: "Af1898_0115.31.jpg",
  museumUrl: "https://www.britishmuseum.org/collection/object/E_Af1898-0115-31",
  physicalLocation: "British Museum, Room 25 - Africa, Display Case 7",
  ownershipStatus: "British Museum collection record",
  note:
    "Manual visual comparison suggests a likely object-level match; verify against plaque details before treating as exact.",
},
];
