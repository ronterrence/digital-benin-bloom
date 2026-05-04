export interface AtlasRawEntry {
  accession_number: string | null;
  title: string | null;
  description: string | null;
  provenance: string | null;
  section: string | null;
  image_file: string | null;
  page_number: number | null;
  has_description: boolean;
  has_provenance: boolean;
  has_section: boolean;
  has_image: boolean;
  data_quality: number;
}

export const atlasRaw: AtlasRawEntry[] = [
  {
    accession_number: "1917.38.2",
    title: "Bronze bell",
    description: null,
    provenance: null,
    section: null,
    image_file: "fig_073.jpg",
    page_number: null,
    has_description: false,
    has_provenance: false,
    has_section: false,
    has_image: true,
    data_quality: 4,
  },
  {
    accession_number: "1900.39.17",
    title: "Iron armlet",
    description: null,
    provenance: null,
    section: null,
    image_file: "fig_037.jpg",
    page_number: null,
    has_description: false,
    has_provenance: false,
    has_section: false,
    has_image: true,
    data_quality: 4,
  },
  {
    accession_number: "1898.26.1.1",
    title: "Brass powder cylinder",
    description: null,
    provenance: null,
    section: null,
    image_file: "fig_030.jpg",
    page_number: null,
    has_description: false,
    has_provenance: false,
    has_section: false,
    has_image: true,
    data_quality: 2,
  }
];