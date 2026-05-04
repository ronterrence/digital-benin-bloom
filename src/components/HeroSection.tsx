import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  const scrollToGallery = () => {
    document.getElementById('methodology')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      {/* Subtle radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(43_52%_54%_/_0.04)_0%,_transparent_70%)]" />

      <div className="relative z-10 max-w-3xl animate-fade-in">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-muted-foreground">
          A Digital Archive
        </p>
        <h1 className="mb-6 text-5xl font-bold leading-tight text-gold-gradient md:text-7xl">
          Benin Digital Exhibition
        </h1>
		<p className="text-center text-muted-foreground max-w-2xl mx-auto">
		Exploring the extraordinary bronze plaques and sculptures from the Kingdom of Benin, as documented in Pitt Rivers' 1900 publication
		</p>
		<p className="text-center italic text-primary mt-2">
		"Antique Works of Art from Benin"
		</p>
        <p className="mx-auto mb-10 max-w-xl text-sm text-muted-foreground">
          239 artifacts - 11 visual clusters - AI-enhanced reconstructions
        </p>
        <Button
          onClick={scrollToGallery}
          size="lg"
          className="group gap-2 rounded-full border border-primary/30 bg-transparent px-8 text-primary hover:bg-primary hover:text-primary-foreground"
        >
          Enter the Archive
          <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
        </Button>
      </div>
    </section>
  );
}
