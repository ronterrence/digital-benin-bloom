import AudioNarrativeBlock from "@/components/AudioNarrativeBlock";
import { militaryTranscript } from "@/data/transcripts/militaryTranscript";
import { potteryTranscript } from "@/data/transcripts/potteryTranscript";
import PotteryEvidenceSection from "@/components/PotteryEvidenceSection";
import { asset } from "@/lib/asset";



export default function AudioNarrativesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 pt-24 pb-16 text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.25em] text-muted-foreground">
          Audio Narratives
        </p>

        <h1 className="text-4xl font-semibold text-gold md:text-5xl">
          From Objects to Events
        </h1>

        <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
          This section presents audio interpretations that connect the objects in the
          exhibition to historical encounter, material meaning, and cultural context.
        </p>

        <p className="mx-auto mt-6 max-w-3xl text-sm italic leading-6 text-muted-foreground">
          Source note: These narratives combine archival material, comparative interpretation,
          and curatorial framing. Where colonial sources are used, they are presented critically.
        </p>
      </div>

      <div className="mx-auto max-w-4xl px-6 pb-24">
        <AudioNarrativeBlock
          id="military"
          title="Military Encounter"
          description="Based on The Benin Massacre (1897), a firsthand colonial account written by Captain Alan Boisragon, this narrative examines the violent encounter, trade history, and colonial framing that shaped the displacement of Benin's artworks."
		  audioSrc={asset("audio/benin-expedition-narrative.m4a")}
          transcript={militaryTranscript}
        />

        <div className="my-20 flex items-center justify-center">
          <div className="h-px w-full max-w-xs bg-border/50" />
        </div>

        <AudioNarrativeBlock
		  id="pottery"
		  title="Pottery Comparisons"
		  description="This second narrative shifts from military encounter to material culture, examining pottery through comparison, continuity, form, and cultural meaning."
		  audioSrc={asset("audio/pottery-comparisons.m4a")}
		  transcript={potteryTranscript}
		/>

		<PotteryEvidenceSection />
		
      </div>
    </div>
  );
}
