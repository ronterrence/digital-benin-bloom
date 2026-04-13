import { useState } from "react";

export default function PotteryEvidenceSection() {
  const [showFigure, setShowFigure] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showResearch, setShowResearch] = useState(false);

  return (
    <section className="mt-14 space-y-8">
      <div className="rounded-xl border border-border/50 p-6 md:p-8">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Supporting Figure
        </p>
        <h3 className="mb-4 text-xl font-semibold text-gold">
          Fig. 26 — Pottery Sketches
        </h3>

        <button
          type="button"
          onClick={() => setShowFigure(!showFigure)}
          className="text-sm text-gold transition hover:underline"
        >
          {showFigure ? "Hide figure" : "View figure"}
        </button>

        {showFigure && (
          <>
            <div className="mt-4 overflow-hidden rounded-lg border border-border/50 bg-muted/20">
              <img
                src="/images/fig-26-benin-pottery.jpg"
                alt="Figure 26 pottery sketches from The Archaeology of Benin"
                className="w-full object-contain"
              />
            </div>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
              Fig. 26 is central to the pottery narrative because it concentrates the attribution problem:
              incised and impressed decoration was too quickly collapsed into an Egyptian category, even
              though the technical evidence points elsewhere.
            </p>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
              In the comparative argument developed for this exhibition, the drawing is used not as proof
              of a single origin, but as a case study in how motif, technique, and typology can be
              confused when African material histories are read through overly Egyptianizing assumptions.
            </p>

            <p className="mt-4 text-xs italic text-muted-foreground">
              Source: Graham Connah, <em>The Archaeology of Benin</em> (1975).
            </p>
          </>
        )}
      </div>

      <div className="rounded-xl border border-border/50 p-6 md:p-8">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Comparative Diagram
        </p>
        <h3 className="mb-4 text-xl font-semibold text-gold">
          African Pottery Heritage Map
        </h3>

        <button
          type="button"
          onClick={() => setShowMap(!showMap)}
          className="text-sm text-gold transition hover:underline"
        >
          {showMap ? "Hide diagram" : "View diagram"}
        </button>

        {showMap && (
          <>
            <div className="mt-4 overflow-hidden rounded-lg border border-border/50 bg-black p-8 md:p-12">
              <img
                src="/images/african-pottery-heritage-map.svg"
                alt="Comparative map of African pottery heritage interactions"
                className="mx-auto w-full max-w-5xl object-contain"
              />
            </div>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
              This diagram summarizes the broader interaction field behind the audio narrative: shared
              ceramic foundations across Africa, divergence in production systems, and later political
              and colonial ruptures that shaped how pottery traditions were interpreted.
            </p>
          </>
        )}
      </div>

      <div className="rounded-xl border border-border/50 p-6 md:p-8">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Research Note
        </p>
        <h3 className="mb-4 text-xl font-semibold text-gold">
          Attribution, Bias, and Exchange
        </h3>

        <button
          type="button"
          onClick={() => setShowResearch(!showResearch)}
          className="text-sm text-gold transition hover:underline"
        >
          {showResearch ? "Hide note" : "Read note"}
        </button>

        {showResearch && (
          <div className="mt-4 max-w-3xl space-y-4 text-sm leading-7 text-muted-foreground">
            <p>
              The supporting research argues that identifying Fig. 26 as Egyptian Naqada II D-ware is
              incorrect. D-ware is a painted tradition, whereas the Fig. 26 sketches show incised and
              impressed decoration; the closer Egyptian parallel is N-ware, explicitly associated with
              Nubian pottery traditions.
            </p>

            <p>
              The same research also stresses that the wavy-line tradition predates dynastic Egypt and
              should not be narrated simply as a north-to-south diffusion from Egypt into Nubia or West
              Africa. It instead points toward a deeper African ceramic genealogy with regional
              continuities and divergences.
            </p>

            <p>
              At the same time, the argument adds an important corrective to any overly closed
              pan-African framing: Predynastic Egyptian pottery also reflects exchange with the Levant,
              including Palestinian imports in Egyptian graves and Egyptian wares found in Palestinian
              contexts. That introduces a third axis of ceramic interaction beyond a simple
              Benin–Nubia–Egypt comparison.
            </p>

            <p>
              In other words, the pottery narrative should be read as a critical reconstruction of
              patterns and probabilities, not as a claim of pure or isolated origins.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}