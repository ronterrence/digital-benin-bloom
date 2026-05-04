type AboutConfig = {
  authorName: string;
};

function generateAboutContent(config: AboutConfig) {
  return {
    author: `
This digital exhibition was developed by ${config.authorName} as part of an exploration into how African cultural heritage can be reinterpreted through digital systems, narrative structures, and interactive design.
    `.trim(),

    intent: `
The project engages with the history of the Kingdom of Benin not as a distant past, but as a living cultural system disrupted by the events of 1897. It considers how objects once embedded in ritual, power, and daily life became displaced and recontextualized within global collections.

Developed as part of my ongoing exploration of AI, cultural memory, and digital preservation at Media University Berlin, the project was primarily shaped by the course AI for Cultural Heritage Preservation and by preservation techniques encountered there.

The archive now separates the Pitts visual source layer, Oxford museum collections, British Museum collections, context images, and a growing cross-reference layer. Its next phase is to manually compare records, identify likely object matches, and document where these objects are currently located and how their status changes over time.
`.trim(),

    methodologyIntro: `
The exhibition combines structured data, visual analysis, and controlled digital reconstruction to create a layered way of encountering Benin's material heritage. Rather than producing speculative outputs, the project prioritizes structure-preserving transformations that maintain fidelity to archival sources while improving visual legibility.
    `.trim(),

    methodologyBlocks: [
      {
        title: "Dataset",
        text: "A structured dataset of artifacts forms the foundation of the exhibition, allowing the objects to be organized, described, and explored beyond static display."
      },
      {
        title: "Clustering & Comparison",
        text: "Artifacts are grouped through clustering and visual comparison, revealing relationships in form, iconography, and function across the archive."
      },
      {
        title: "AI-assisted Reconstruction",
        text: "Selected artifacts are presented through original scans, enhanced images, and non-generative bronze reconstructions. The process preserves structural detail while improving visual legibility."
      },
      {
        title: "Narrative Interpretation",
        text: "Audio narratives, historical sources, and contextual framing extend the archive into an exhibition experience, connecting the objects to violence, displacement, survival, and memory."
      },

      {
        title: "Archive Text Improvement",
        text: "A continuing task is to improve the machine-extracted archive descriptions. Some current text was extracted automatically and may contain formatting errors, outdated characters, broken strings, or OCR-like inconsistencies. These descriptions will be reviewed, cleaned, and corrected gradually to improve readability while preserving their source value."
      },

      {
        title: "Institutional Expansion",
        text: "Future development will extend the holdings layer beyond Oxford and the British Museum to include important collections in Vienna, Cambridge, Cologne, Dresden, Hamburg, Leipzig, Stuttgart, the Netherlands, Scotland, Stockholm, and major museums in the United States, including Chicago, Boston, New York, Washington, and Philadelphia. This may later become a dedicated Dispersal Map / Institutional Holdings section."
      },

      {
        title: "MOWAA and Nigerian Museums",
        text: "A future research direction is to connect this work with MOWAA-related research by identifying artifacts physically located in museums in Lagos, and Benin, Nigeria which will bring the archive closer to present-day questions of location, access, restitution, and cultural reconstruction. Stay tuned."
      }


    ],
	
	
	

    structure: `
The exhibition is organized as a journey: from object exploration (Archive), to historical interpretation (Audio Narratives), to physical traces (Survival), and finally reflection (Epilogue). Each section offers a different way of engaging with the same material - from presence, to rupture, to memory.
    `.trim(),

    signature: `
This exhibition is not only about what was taken, but about what remains - in form, in memory, and in the ways we choose to see it.
    `.trim(),
  };
}

export default generateAboutContent;
