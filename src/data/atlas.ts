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
  },
  
  {
    id: "fig_019",
    pittRivers: {
      image: "fig_019.jpg",
      cluster: 7,
      description: "Ivory carving of figure on horse."
    },
    oxford: {
      objectType: "Wooden figure of a horse-rider",
      collection: "Oxford 1897 Benin Collection",
      acquisitionDate: "1900",
      location: "Benin City, Nigeria",
      notes: "Cross-collection iconographic match based on mounted rider motif."
    },
    metadata: {
      period: "Pre-1897",
      event: "1897 British Punitive Expedition",
      origin: "Kingdom of Benin"
    },
    confidence: 0.75
  },

  {
    id: "fig_022",
    pittRivers: {
      image: "fig_022.jpg",
      cluster: 7,
      description: "Ivory carving of figure on horse, with spear."
    },
    oxford: {
      objectType: "Wooden figure of a horse-rider",
      collection: "Oxford 1897 Benin Collection",
      acquisitionDate: "1900",
      location: "Benin City, Nigeria",
      notes: "Strong motif-level match: rider, horse, courtly carving."
    },
    metadata: {
      period: "Pre-1897",
      event: "1897 British Punitive Expedition",
      origin: "Kingdom of Benin"
    },
    confidence: 0.78
  },

  {
    id: "fig_037",
    pittRivers: {
      image: "fig_037.jpg",
      cluster: 5,
      description: "Bracelet of brass, somewhat twisted."
    },
    oxford: {
      objectType: "Armlet / Regalia",
      collection: "Oxford 1897 Benin Collection",
      acquisitionDate: "1900",
      location: "Benin City, Nigeria",
      notes: "Category-level match within armlets and personal regalia."
    },
    metadata: {
      period: "Pre-1897",
      event: "1897 British Punitive Expedition",
      origin: "Kingdom of Benin"
    },
    confidence: 0.82
  },

  {
    id: "fig_038",
    pittRivers: {
      image: "fig_038.jpg",
      cluster: 5,
      description: "Bracelet of brass, with five projections set with agate."
    },
    oxford: {
      objectType: "Armlet / Regalia",
      collection: "Oxford 1897 Benin Collection",
      acquisitionDate: "1900",
      location: "Benin City, Nigeria",
      notes: "Strong category match: brass status ornament."
    },
    metadata: {
      period: "Pre-1897",
      event: "1897 British Punitive Expedition",
      origin: "Kingdom of Benin"
    },
    confidence: 0.84
  },

  {
    id: "fig_039",
    pittRivers: {
      image: "fig_039.jpg",
      cluster: 1,
      description: "Brass bracelet, with negro heads of copper inlaid."
    },
    oxford: {
      objectType: "Armlet / Regalia",
      collection: "Oxford 1897 Benin Collection",
      acquisitionDate: "1900",
      location: "Benin City, Nigeria",
      notes: "High-value regalia alignment; human-head ornamentation strengthens the link."
    },
    metadata: {
      period: "Pre-1897",
      event: "1897 British Punitive Expedition",
      origin: "Kingdom of Benin"
    },
    confidence: 0.88
  },

  {
    id: "fig_047",
    pittRivers: {
      image: "fig_047.jpg",
      cluster: 2,
      description: "Bracelet of bronze, ornamented with two rudely formed human heads."
    },
    oxford: {
      objectType: "Armlet / Regalia",
      collection: "Oxford 1897 Benin Collection",
      acquisitionDate: "1900",
      location: "Benin City, Nigeria",
      notes: "Category and motif alignment with armlet group."
    },
    metadata: {
      period: "Pre-1897",
      event: "1897 British Punitive Expedition",
      origin: "Kingdom of Benin"
    },
    confidence: 0.83
  },

  {
    id: "fig_049",
    pittRivers: {
      image: "fig_049.jpg",
      cluster: 1,
      description: "Narrow armlet of brass, with a succession of animals in relief."
    },
    oxford: {
      objectType: "Armlet / Regalia",
      collection: "Oxford 1897 Benin Collection",
      acquisitionDate: "1900",
      location: "Benin City, Nigeria",
      notes: "Animal-decorated armlet; useful for atlas regalia grouping."
    },
    metadata: {
      period: "Pre-1897",
      event: "1897 British Punitive Expedition",
      origin: "Kingdom of Benin"
    },
    confidence: 0.81
  },

  {
    id: "fig_058",
    pittRivers: {
      image: "fig_058.jpg",
      cluster: 1,
      description: "Leopard's mask head of brass."
    },
    oxford: {
      objectType: "Bronze hip-ornament mask",
      collection: "Oxford 1897 Benin Collection",
      acquisitionDate: "1900",
      location: "Benin City, Nigeria",
      notes: "Probable mask-family match; leopard imagery is a strong royal signal."
    },
    metadata: {
      period: "Pre-1897",
      event: "1897 British Punitive Expedition",
      origin: "Kingdom of Benin"
    },
    confidence: 0.76
  },

  {
    id: "fig_060",
    pittRivers: {
      image: "fig_060.jpg",
      cluster: 1,
      description: "Leopard's mask head of brass."
    },
    oxford: {
      objectType: "Bronze hip-ornament mask",
      collection: "Oxford 1897 Benin Collection",
      acquisitionDate: "1900",
      location: "Benin City, Nigeria",
      notes: "Mask-category and leopard motif alignment."
    },
    metadata: {
      period: "Pre-1897",
      event: "1897 British Punitive Expedition",
      origin: "Kingdom of Benin"
    },
    confidence: 0.77
  },

  {
    id: "fig_062",
    pittRivers: {
      image: "fig_062.jpg",
      cluster: 1,
      description: "Leopard's head in brass."
    },
    oxford: {
      objectType: "Bronze hip-ornament mask depicting a leopard-related form",
      collection: "Oxford 1897 Benin Collection",
      acquisitionDate: "1900",
      location: "Benin City, Nigeria",
      notes: "Animal-head alignment; weaker than fig_058/060 for mask-specific match."
    },
    metadata: {
      period: "Pre-1897",
      event: "1897 British Punitive Expedition",
      origin: "Kingdom of Benin"
    },
    confidence: 0.68
  },

  {
    id: "fig_066",
    pittRivers: {
      image: "fig_066.jpg",
      cluster: 7,
      description: "Historic mace or staff of office of Duboar, late King of Benin."
    },
    oxford: {
      objectType: "Brass staff with the figure of a bird",
      collection: "Oxford 1897 Benin Collection",
      acquisitionDate: "1900",
      location: "Benin City, Nigeria",
      notes: "Ceremonial staff/staff-of-office alignment; strong for atlas ceremonial category."
    },
    metadata: {
      period: "Pre-1897",
      event: "1897 British Punitive Expedition",
      origin: "Kingdom of Benin"
    },
    confidence: 0.74
  },

  {
    id: "fig_073",
    pittRivers: {
      image: "fig_073.jpg",
      cluster: 5,
      description: "Three triangular brass bells."
    },
    oxford: {
      objectType: "Bronze bells",
      collection: "Oxford 1897 Benin Collection",
      acquisitionDate: "1900",
      location: "Benin City, Nigeria",
      notes: "One of the strongest cross-collection category matches."
    },
    metadata: {
      period: "Pre-1897",
      event: "1897 British Punitive Expedition",
      origin: "Kingdom of Benin"
    },
    confidence: 0.92
  },

  {
    id: "fig_102",
    pittRivers: {
      image: "fig_102.jpg",
      cluster: 9,
      description: "Weaving tool / apparatus."
    },
    oxford: {
      objectType: "Wooden weaving apparatus",
      collection: "Oxford 1897 Benin Collection",
      acquisitionDate: "1899",
      location: "Benin City, Nigeria",
      notes: "Direct category match to Webster weaving group."
    },
    metadata: {
      period: "Pre-1897",
      event: "1897 British Punitive Expedition",
      origin: "Kingdom of Benin"
    },
    confidence: 0.91
  },

  {
    id: "fig_104",
    pittRivers: {
      image: "fig_104.jpg",
      cluster: 9,
      description: "Weaving tool / apparatus."
    },
    oxford: {
      objectType: "Wooden weaving apparatus",
      collection: "Oxford 1897 Benin Collection",
      acquisitionDate: "1899",
      location: "Benin City, Nigeria",
      notes: "Textile-tool family match."
    },
    metadata: {
      period: "Pre-1897",
      event: "1897 British Punitive Expedition",
      origin: "Kingdom of Benin"
    },
    confidence: 0.9
  },

  {
    id: "fig_106",
    pittRivers: {
      image: "fig_106.jpg",
      cluster: 9,
      description: "Weaving tool / apparatus."
    },
    oxford: {
      objectType: "Wooden weaving apparatus",
      collection: "Oxford 1897 Benin Collection",
      acquisitionDate: "1899",
      location: "Benin City, Nigeria",
      notes: "Category-level textile match; useful for domestic material culture atlas layer."
    },
    metadata: {
      period: "Pre-1897",
      event: "1897 British Punitive Expedition",
      origin: "Kingdom of Benin"
    },
    confidence: 0.9
  }
];