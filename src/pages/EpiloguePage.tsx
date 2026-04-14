import { Link } from "react-router-dom";
import { asset } from "@/lib/asset"; // ← add at top


export default function EpiloguePage() {
  return (
    <div className="min-h-screen bg-background px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">

        <p className="mb-3 text-sm uppercase tracking-[0.25em] text-muted-foreground">
          Epilogue
        </p>

        <h1 className="mb-6 text-4xl md:text-5xl font-semibold text-gold">
          The Lost City
        </h1>

        <p className="mx-auto mb-16 max-w-2xl text-lg leading-8 text-muted-foreground">
          Before its destruction, Great Ubini — the Kingdom of Benin — was a thriving
          and sophisticated city, known for its architecture, artistry, and political organization.
          What remains today are fragments — physical, digital, and remembered.
        </p>

        <div className="mb-12">
          <video controls className="w-full rounded-lg border border-border/50 shadow-sm">
            <source src={asset("videos/lost-city.mp4")} type="video/mp4" />
          </video>
        </div>

        <p className="mx-auto max-w-2xl text-sm italic text-muted-foreground">
          What is lost is not only what is destroyed — but what is no longer remembered.
        </p>

        <div className="mt-12">
          <Link
            to="/"
            className="inline-block text-sm text-gold/80 hover:text-gold transition"
          >
            Return to exhibition →
          </Link>
        </div>

      </div>
    </div>
  );
}