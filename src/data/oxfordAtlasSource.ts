import oxfordAtlasSourceJson from "../../data/normalized/oxford_atlas_source.json";

export interface OxfordAtlasSourceRow {
  sourceInstitution: string;
  sourceDataset: string;
  accessionNumber: string;
  objectTitle: string | null;
  objectDescription: string | null;
  sourceSection: string | null;
  sourcePage: number | string | null;
  imageFile: string | null;
  imageStatus: string | null;
  provenance: string | null;
  provenanceDetail: string | null;
  publicationNotes: string | null;
  benin1897Status: string | null;
  hasDescription: boolean;
  hasImage: boolean;
  matched: boolean;
}

export const oxfordAtlasSource: OxfordAtlasSourceRow[] =
  oxfordAtlasSourceJson as OxfordAtlasSourceRow[];