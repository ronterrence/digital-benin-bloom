import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-3xl text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.25em] text-muted-foreground">
          A Digital Exhibition
        </p>

        <h1 className="mb-6 text-5xl font-semibold text-gold md:text-7xl">
          Benin Digital Exhibition
        </h1>

        <p className="mb-10 text-lg leading-8 text-muted-foreground md:text-xl">
          Exploring the extraordinary bronze plaques and sculptures of the Kingdom of Benin -
          from their creation, to their displacement, and what remains today.
        </p>

        <div className="mb-10">
          <Link
            to="/archive"
            className="inline-block rounded-lg border border-border px-8 py-3 text-gold transition hover:bg-muted"
          >
            Enter the Exhibition
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <Link to="/audio" className="hover:text-gold transition">
            Audio Narratives
          </Link>
          <Link to="/survival" className="hover:text-gold transition">
            Survival
          </Link>
          <Link to="/epilogue" className="hover:text-gold transition">
            Epilogue
          </Link>
          <Link to="/about" className="hover:text-gold transition">
            About
          </Link>
        </div>
      </div>
    </div>
  );
}