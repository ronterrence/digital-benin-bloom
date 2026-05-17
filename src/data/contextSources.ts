export type ContextSource = {
  id: string;
  title: string;
  source: string;
  url: string;
  category: "article" | "archive" | "museum" | "dataset" | "book";
  imageCredit?: string;
  sourceCaption?: string;
  interpretiveNote?: string;
  note: string;
};

export const contextSources: ContextSource[] = [
  {
    id: "cnn_benin_chiefs_galway_1892",
    title: "Meeting between Benin chiefs and Vice-Consul Henry Galway, 1892",
    source: "CNN  / Smithsonian National Museum of African Art",
    url: "https://edition.cnn.com/style/article/brutish-museums-benin-bronzes/index.html",
    category: "article",
    imageCredit:
      "Eliot Elisofon Photographic Archives, National Museum of African Art, Smithsonian Institution",

    sourceCaption:
      "A meeting between Benin chiefs and Vice-Consul Henry Galway of the Niger Coast Protectorate in 1892. The British wanted palm oil and rubber from Bini territory, and plotted to depose the king over restrictions on trade.",

    interpretiveNote:
      "This image is not just a diplomatic scene. It reveals the pressure building before 1897: British officials were negotiating access, testing authority, and seeking control over palm oil and rubber trade. What was later framed as obstruction by the Oba can also be read as sovereignty — the right of Benin to regulate commerce within its own territory.",

    note: "This image is used here to frame the pre-1897 political and commercial pressure surrounding trade, sovereignty, and colonial expansion.",
  },
];