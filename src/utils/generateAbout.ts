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
    `.trim(),

    methodologyIntro: `
The exhibition combines structured data, visual analysis, and controlled digital reconstruction to create a layered way of encountering Benin’s material heritage. Rather than producing speculative outputs, the project prioritizes structure-preserving transformations that maintain fidelity to archival sources while improving visual legibility.
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
      }
    ],
	
	
	

    structure: `
The exhibition is organized as a journey: from object exploration (Archive), to historical interpretation (Audio Narratives), to physical traces (Survival), and finally reflection (Epilogue). Each section offers a different way of engaging with the same material — from presence, to rupture, to memory.
    `.trim(),

    signature: `
This exhibition is not only about what was taken, but about what remains — in form, in memory, and in the ways we choose to see it.
    `.trim(),
  };
}

export default generateAboutContent;