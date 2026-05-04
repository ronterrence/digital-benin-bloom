import generateAboutContent from "../utils/generateAbout";
import { asset } from "@/lib/asset";

export default function AboutPage() {
  const about = generateAboutContent({
    authorName: "RCO Udom",
  });

  return (
    <div className="min-h-screen bg-background px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <p className="mb-3 text-sm uppercase tracking-[0.25em] text-muted-foreground">
          About
        </p>

        <h1 className="mb-12 text-4xl font-semibold text-gold md:text-5xl">
          Author & Methodology
        </h1>

        <div className="mb-16 grid gap-10 md:grid-cols-[260px_1fr] md:items-start">
          <div>
            <div className="max-w-[260px] overflow-hidden rounded-xl border border-border/50">
              <img
                src={asset("images/author.png")}
                alt="Author portrait"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div>
            <div className="mb-10">
              <h2 className="mb-2 text-lg font-medium text-foreground tracking-wide">
                Author
              </h2>
              <p className="text-sm leading-7 text-muted-foreground">
                {about.author}
              </p>
            </div>

            <div className="mb-10">
              <h2 className="text-lg font-medium text-foreground tracking-wide">
                Project Intent
              </h2>
              <p className="text-sm leading-7 text-muted-foreground">
                {about.intent}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12 border-t border-border/50 pt-12">
          <h2 className="text-lg font-medium text-foreground tracking-wide">
            Methodology
          </h2>

          <p className="mb-8 max-w-3xl text-sm leading-7 text-muted-foreground">
            {about.methodologyIntro}
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {about.methodologyBlocks.map((block) => (
              <div
                key={block.title}
                className="rounded-xl border border-border/50 p-6"
              >
                <h3 className="mb-2 text-base font-semibold text-gold">
                  {block.title}
                </h3>
                <p className="text-sm leading-7 text-muted-foreground">
                  {block.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-xl border border-border/50 p-6 md:p-8">
            <h3 className="mb-4 text-lg font-semibold text-gold">
              Reconstruction Method
            </h3>

            <p className="mb-4 max-w-3xl text-sm leading-7 text-muted-foreground">
              This exhibition presents three visual layers for selected artifacts: the
              original archival scan, an enhanced version for clarity, and a
              non-generative bronze reconstruction.
            </p>

            <p className="mb-6 max-w-3xl text-sm leading-7 text-muted-foreground">
              Unlike generative AI approaches, the bronze reconstruction process does not
              invent or alter structural details. Instead, it applies controlled image
              processing techniques to preserve the original geometry while improving
              material readability.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-border/50 p-4">
                <h4 className="mb-2 text-sm font-semibold text-foreground">
                  Detail Enhancement
                </h4>
                <p className="text-sm leading-6 text-muted-foreground">
                  Super-resolution (RealESRGAN x2) to recover fine surface features.
                </p>
              </div>

              <div className="rounded-lg border border-border/50 p-4">
                <h4 className="mb-2 text-sm font-semibold text-foreground">
                  Structure Preservation
                </h4>
                <p className="text-sm leading-6 text-muted-foreground">
                  Edge-preserving processing to maintain original carvings and contours.
                </p>
              </div>

              <div className="rounded-lg border border-border/50 p-4">
                <h4 className="mb-2 text-sm font-semibold text-foreground">
                  Material Mapping
                </h4>
                <p className="text-sm leading-6 text-muted-foreground">
                  Deterministic bronze tone mapping based on grayscale intensity.
                </p>
              </div>

              <div className="rounded-lg border border-border/50 p-4">
                <h4 className="mb-2 text-sm font-semibold text-foreground">
                  Background Separation
                </h4>
                <p className="text-sm leading-6 text-muted-foreground">
                  Segmentation to isolate artifacts and prevent color contamination.
                </p>
              </div>

              <div className="rounded-lg border border-border/50 p-4 md:col-span-2">
                <h4 className="mb-2 text-sm font-semibold text-foreground">
                  Reference Calibration
                </h4>
                <p className="text-sm leading-6 text-muted-foreground">
                  Optional color alignment using real museum bronze samples.
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-3xl text-sm italic leading-7 text-muted-foreground">
              The bronze reconstructions are non-generative, structure-preserving material
              interpretations. They should not be considered exact historical color
              restitutions.
            </p>
			<div className="my-10 border-t border-border/30" />
            <div className="mt-14 border-t border-border/50 pt-12">
               <h3 className="mb-6 text-lg font-semibold text-gold tracking-wide">
                Reconstruction Pipeline
              </h3>

              <div className="flex flex-col items-center gap-6 text-xs text-muted-foreground md:flex-row">
                <div className="flex flex-col items-center text-center">
				  <div className="rounded-full border border-border/50 px-4 py-2 transition hover:border-gold/40">
                    Scan
                  </div>
                  <span className="mt-2">Archival Source</span>
                </div>

                <span className="hidden md:block text-muted-foreground/40">-&gt;</span>

                <div className="flex flex-col items-center text-center">
				<div className="rounded-full border border-border/50 px-4 py-2 transition hover:border-gold/40">                    Enhance
                  </div>
                  <span className="mt-2">Super-resolution</span>
                </div>

                <span className="hidden md:block">-&gt;</span>

                <div className="flex flex-col items-center text-center">
				<div className="rounded-full border border-border/50 px-4 py-2 transition hover:border-gold/40">                    Preserve
                  </div>
                  <span className="mt-2">Edge / Structure</span>
                </div>

                <span className="hidden md:block">-&gt;</span>

                <div className="flex flex-col items-center text-center">
				<div className="rounded-full border border-border/50 px-4 py-2 transition hover:border-gold/40">				  
                    Map
                  </div>
                  <span className="mt-2">Bronze Tone</span>
                </div>

                <span className="hidden md:block">-&gt;</span>

                <div className="flex flex-col items-center text-center">
				<div className="rounded-full border border-border/50 px-4 py-2 transition hover:border-gold/40">                    Output
                  </div>
                  <span className="mt-2">Reconstruction</span>
                </div>
              </div>

              <p className="mt-6 max-w-2xl text-xs italic text-muted-foreground">
                Non-generative pipeline - structure preserved from original archival material.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12 border-t border-border/50 pt-12">
          <h2 className="mb-3 text-lg font-medium text-foreground tracking-wide">
            Exhibition Structure
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
            {about.structure}
          </p>
        </div>

        <div className="mt-16 border-t border-border/50 pt-12">
          <p className="max-w-2xl text-sm italic text-muted-foreground">
            {about.signature}
          </p>
        </div>
      </div>
    </div>
  );
}
