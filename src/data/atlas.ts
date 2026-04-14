export interface AtlasEntry {
  id: string;

  pittRivers: {
    image: string;
    cluster: number;
    description: string;
  };

  oxford?: {
    objectType: string;
    collection: string;
    acquisitionDate: string;
    location: string;
    notes?: string;
  };

  confidence: number;
}

export const atlas: AtlasEntry[] = [
  {
    id: "fig_074",
    pittRivers: {
      image: "fig_074.jpg",
      cluster: 4,
      description: "Bronze bell"
    },
    oxford: {
      objectType: "Brass Bell",
      collection: "Oxford 1897 Benin Collection",
      acquisitionDate: "1897",
      location: "Benin City, Nigeria",
      notes: "Collected during the 1897 British Punitive Expedition"
    },
    confidence: 0.92
  },

  {
    id: "fig_132",
    pittRivers: {
      image: "fig_132.jpg",
      cluster: 8,
      description: "Ivory carved object"
    },
    oxford: {
      objectType: "Ivory Door Bolt",
      collection: "Oxford 1897 Benin Collection",
      acquisitionDate: "1897",
      location: "Benin Royal Palace",
      notes: "Architectural palace element"
    },
    confidence: 0.93
  },

  {
    id: "fig_102",
    pittRivers: {
      image: "fig_102.jpg",
      cluster: 9,
      description: "Weaving apparatus"
    },
    oxford: {
      objectType: "Weaving Tool",
      collection: "Oxford 1897 Benin Collection",
      acquisitionDate: "1897",
      location: "Benin City",
      notes: "Domestic textile production"
    },
    confidence: 0.91
  },

  {
    id: "fig_120",
    pittRivers: {
      image: "fig_120.jpg",
      cluster: 1,
      description: "Armlet"
    },
    oxford: {
      objectType: "Armlet / Regalia",
      collection: "Oxford 1897 Benin Collection",
      acquisitionDate: "1897",
      location: "Royal Court of Benin",
      notes: "Symbol of rank and authority"
    },
    confidence: 0.90
  }
];