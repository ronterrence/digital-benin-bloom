export type RestitutionRecord = {
  id: string;
  institution: string;
  institutionShortName: string;
  transferInstitution?: string;
  transferInstitutionShortName?: string;
  city: string;
  country: string;

  title: string;
  englishTitle?: string;
  inventoryNumber: string;
  objectUrl: string;

  imageFile?: string;

  objectType?: string;
  productionDate?: string;
  productionPlace?: string;
  culture?: string;
  material?: string;
  technique?: string;
  dimensions?: string;
  rights?: string;

  description?: string;
  citation?: string;

  provenanceResearchStatus?: string;
  restitutionStatus?: string;
  physicalStatus?: string;

  restitutionTimeline?: Array<{
    year?: number;
    date?: string;
    event: string;
  }>;
};

export const restitutionRecords: RestitutionRecord[] = [
  {
    id: "mkg_dc00123526",
    institution: "Museum für Kunst & Gewerbe Hamburg",
    institutionShortName: "MK&G",
    transferInstitution: "Museum am Rothenbaum – Kulturen und Künste der Welt",
    transferInstitutionShortName: "MARKK",
    city: "Hamburg",
    country: "Germany",

    title: "Kopf eines Oba (Königs)",
    englishTitle: "Head of an Oba (King)",
    inventoryNumber: "1897.472",
    objectUrl: "https://www.mkg-hamburg.de/en/object/dc00123526",

    imageFile: "1897.472-1.jpg",

    objectType: "Commemorative royal head",
    productionDate: "Early 17th century",
    productionPlace: "Benin",
    culture: "Benin / Edo",
    material: "Bronze, iron",
    technique: "Cast",
    dimensions: "Height 26.8 cm; diameter 19.3 cm; depth 20 cm",
    rights: "Public Domain",

    description:
      "Commemorative royal head associated with Benin court altar practice. Such heads formed part of royal memorial and dynastic traditions and could support carved elephant tusks.",

    citation:
      "Kopf eines Oba (Königs), Museum für Kunst & Gewerbe Hamburg, Public Domain.",

    provenanceResearchStatus: "Identified as looted art",
    restitutionStatus: "Ownership transfer signed",
    physicalStatus:
      "Transferred from MK&G to MARKK; ownership-transfer and return agreement signed with Nigeria in 2022. Further institutional questions are directed to MARKK.",

    restitutionTimeline: [
      {
        year: 2016,
        event:
          "MK&G provenance research concluded that the Benin Bronzes were looted art.",
      },
      {
        year: 2018,
        event:
          "Hamburg decided to transfer the Benin Bronzes from MK&G to MARKK.",
      },
      {
        date: "2021-09-30",
        event: "The Benin Bronzes were handed over to MARKK.",
      },
      {
        date: "2022-12-16",
        event:
          "A contract for full ownership transfer and return of the bronzes to Nigeria was signed.",
      },
    ],
  },
  {
  id: "mkg_dc00123548",
  institution: "Museum für Kunst & Gewerbe Hamburg",
  institutionShortName: "MK&G",
  transferInstitution: "Museum am Rothenbaum – Kulturen und Künste der Welt",
  transferInstitutionShortName: "MARKK",
  city: "Hamburg",
  country: "Germany",

  title: "Reliefplatte (Schlachtenszene)",
  englishTitle: "Relief Plaque (Battle Scene)",
  inventoryNumber: "1899.75",
  objectUrl: "https://www.mkg-hamburg.de/en/object/dc00123548",

  imageFile: "1899.75-2.jpg",

  objectType: "Relief plaque",
  productionDate: "Early 17th century",
  productionPlace: "Benin",
  culture: "Benin / Edo",
  material: "Bronze / brass alloy",
  technique: "Cast",
  dimensions: "Height 55.5 cm; width 40 cm; depth 12 cm; weight approx. 26 kg",
  rights: "Public Domain",

  description:
    "Relief plaque from a series believed to document different battle scenes. The central figure is a large Benin military commander shown seizing a divided opponent by the crest of his helmet and pulling him from a horse while raising a sword. Other warriors and defeated figures appear around the scene.",

  citation:
    "Reliefplatte (Schlachtenszene), Museum für Kunst & Gewerbe Hamburg, Public Domain.",

  provenanceResearchStatus: "Identified as looted art",
  restitutionStatus: "Ownership transfer signed",
  physicalStatus:
    "Transferred from MK&G to MARKK; ownership-transfer and return agreement signed with Nigeria in 2022. Further institutional questions are directed to MARKK.",

  restitutionTimeline: [
    {
      year: 2016,
      event:
        "MK&G provenance research concluded that the Benin Bronzes were looted art.",
    },
    {
      year: 2018,
      event:
        "Hamburg decided to transfer the Benin Bronzes from MK&G to MARKK.",
    },
    {
      date: "2021-09-30",
      event: "The Benin Bronzes were handed over to MARKK.",
    },
    {
      date: "2022-12-16",
      event:
        "A contract for full ownership transfer and return of the bronzes to Nigeria was signed.",
    },
  ],
},
];