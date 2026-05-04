import { useEffect, useMemo, useState } from 'react';
import { ZoomIn } from 'lucide-react';
import { type Artifact, mapArtifactImages } from '@/data/artifacts';

interface Props {
  artifact: Artifact;
}

interface Variant {
  key: 'original' | 'enhanced' | 'bronze';
  label: string;
  src: string;
}

interface HoverZoomTileProps {
  artifactId: string;
  variant: Variant;
  onInspect: () => void;
}

interface InspectZoomImageProps {
  src: string;
  alt: string;
}

function HoverZoomTile({ artifactId, variant, onInspect }: HoverZoomTileProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 50, y: 50 });

  const lensSize = 140;
  const zoom = 2.4;

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setLensPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  }

  return (
    <div className="group relative">
      <p className="mb-2 text-center text-sm text-muted-foreground">
        {variant.label}
      </p>

      <div className="relative">
        <button
          type="button"
          onClick={onInspect}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={handleMouseMove}
          className="relative block w-full overflow-hidden rounded-md border border-border/40 bg-background/40 text-left focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <img
            src={variant.src}
            alt={`${artifactId} ${variant.label}`}
            loading="lazy"
            className="h-auto w-full object-contain transition duration-300 group-hover:scale-[1.01]"
          />

          {isHovering && (
            <div
              className="pointer-events-none absolute z-20 overflow-hidden rounded-full border-2 border-white/80 shadow-xl"
              style={{
                width: `${lensSize}px`,
                height: `${lensSize}px`,
                left: `calc(${lensPos.x}% - ${lensSize / 2}px)`,
                top: `calc(${lensPos.y}% - ${lensSize / 2}px)`,
                backgroundImage: `url(${variant.src})`,
                backgroundRepeat: 'no-repeat',
                backgroundColor: 'rgba(0,0,0,0.2)',
                backgroundSize: `${zoom * 100}%`,
                backgroundPosition: `${lensPos.x}% ${lensPos.y}%`,
              }}
            />
          )}
        </button>

        <button
          type="button"
          onClick={onInspect}
          className="absolute right-3 top-3 z-30 rounded-full border border-white/20 bg-black/60 p-2 text-white transition hover:bg-black/80"
          aria-label={`Inspect ${variant.label.toLowerCase()} image`}
          title={`Inspect ${variant.label}`}
        >
          <ZoomIn className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-2 text-center text-xs uppercase tracking-wider text-muted-foreground">
        Hover to zoom • Click to inspect
      </p>
    </div>
  );
}
function InspectZoomImage({ src, alt }: InspectZoomImageProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 50, y: 50 });

  const lensSize = 220;
  const zoom = 3;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setLensPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  }

  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        src={src}
        alt={alt}
        className="max-h-full max-w-full object-contain"
      />

      {isHovering && (
        <div
          className="pointer-events-none absolute z-20 overflow-hidden rounded-full border-2 border-white/80 shadow-2xl"
          style={{
            width: `${lensSize}px`,
            height: `${lensSize}px`,
            left: `calc(${lensPos.x}% - ${lensSize / 2}px)`,
            top: `calc(${lensPos.y}% - ${lensSize / 2}px)`,
            backgroundImage: `url(${src})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: 'rgba(0,0,0,0.18)',
            backgroundSize: `${zoom * 100}%`,
            backgroundPosition: `${lensPos.x}% ${lensPos.y}%`,
          }}
        />
      )}
    </div>
  );
}


export function ArtifactComparison({ artifact }: Props) {
  const images = mapArtifactImages(artifact);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const variants = useMemo<Variant[]>(
    () =>
      [
        { key: 'original', label: 'Original', src: images.original },
        { key: 'enhanced', label: 'Enhanced', src: images.enhanced },
        { key: 'bronze', label: 'Bronze', src: images.bronze },
      ].filter((v) => !!v.src),
    [images]
  );

  const activeVariant = activeIndex !== null ? variants[activeIndex] : null;

  useEffect(() => {
    if (activeIndex === null) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        setActiveIndex(null);
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveIndex((prev) => {
          if (prev === null) return prev;
          return prev > 0 ? prev - 1 : prev;
        });
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveIndex((prev) => {
          if (prev === null) return prev;
          return prev < variants.length - 1 ? prev + 1 : prev;
        });
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, variants.length]);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {variants.map((variant, index) => (
          <HoverZoomTile
            key={variant.key}
            artifactId={artifact.id}
            variant={variant}
            onInspect={() => setActiveIndex(index)}
          />
        ))}
      </div>

      {activeVariant && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 p-4 md:p-8"
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="mx-auto flex h-full max-w-7xl flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-primary">
                  {artifact.id.replace('_', ' ').toUpperCase()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activeVariant.label} view
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((prev) =>
                      prev !== null && prev > 0 ? prev - 1 : prev
                    )
                  }
                  disabled={activeIndex === 0}
                  className="rounded-md border border-white/20 px-3 py-2 text-sm text-white transition hover:bg-white/10 disabled:opacity-30"
                >
                  ← Prev
                </button>

                <button
                  type="button"
                  onClick={() => setActiveIndex(null)}
                  className="rounded-md border border-white/20 px-3 py-2 text-sm text-white transition hover:bg-white/10"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((prev) =>
                      prev !== null && prev < variants.length - 1 ? prev + 1 : prev
                    )
                  }
                  disabled={activeIndex === variants.length - 1}
                  className="rounded-md border border-white/20 px-3 py-2 text-sm text-white transition hover:bg-white/10 disabled:opacity-30"
                >
                  Next →
                </button>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-lg border border-white/10 bg-black/40 p-4">
              <InspectZoomImage
                src={activeVariant.src}
                alt={`${artifact.id} ${activeVariant.label}`}
              />
            </div>

            <div className="mt-3 text-center text-xs uppercase tracking-wider text-muted-foreground">
              Hover to zoom · Esc to close · ← → to switch views
            </div>
          </div>
        </div>
      )}
    </>
  );
}