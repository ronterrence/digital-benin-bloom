import { useEffect, useMemo, useState } from 'react';
import { contextImages } from '@/data/contextImages';

type ContextImage = {
  id: string;
  originalFile: string;
  restoredFile: string;
  page: number;
  title: string;
  caption: string;
};

function getRestoredUrl(file: string) {
  return `${import.meta.env.BASE_URL}benin_output/context_images2_web/${file}`;
}

function getOriginalUrl(file: string) {
  return `${import.meta.env.BASE_URL}benin_output/context/${file}`;
}

export default function ContextGalleryPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'restored' | 'original'>('restored');

  const selectedImage =
    selectedIndex !== null
      ? (contextImages[selectedIndex] as ContextImage | undefined)
      : null;

  const hasPrev = selectedIndex !== null && selectedIndex > 0;
  const hasNext = selectedIndex !== null && selectedIndex < contextImages.length - 1;

  const goPrev = () => {
    setSelectedIndex((prev) => {
      if (prev === null || prev <= 0) return prev;
      return prev - 1;
    });
    setViewMode('restored');
  };

  const goNext = () => {
    setSelectedIndex((prev) => {
      if (prev === null || prev >= contextImages.length - 1) return prev;
      return prev + 1;
    });
    setViewMode('restored');
  };

  const pageRange = useMemo(() => {
    const pages = contextImages.map((image) => image.page);
    return `${Math.min(...pages)}-${Math.max(...pages)}`;
  }, []);

  useEffect(() => {
    if (selectedIndex === null) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setSelectedIndex(null);
      }

      if (e.key === 'ArrowLeft' && hasPrev) {
        e.preventDefault();
        goPrev();
      }

      if (e.key === 'ArrowRight' && hasNext) {
        e.preventDefault();
        goNext();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, hasPrev, hasNext]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-12">
        <div className="text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-muted-foreground">
            Context
          </p>

          <h1 className="text-4xl font-semibold text-gold md:text-5xl">
            Historical Context Images
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
            A separate visual layer of contextual photographs and historical images,
            supporting the narrative around 1897, dispersal, and reconstruction.
          </p>

          <p className="mt-3 text-sm text-muted-foreground">
            {contextImages.length} images - Pages {pageRange}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {contextImages.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => {
                setSelectedIndex(index);
                setViewMode('restored');
              }}
              className="group overflow-hidden rounded-xl border border-border/30 bg-card/40 text-left transition hover:border-primary/30 hover:shadow-[0_0_24px_-12px_hsl(43_52%_54%_/_0.25)]"
            >
              <div className="aspect-[4/3] overflow-hidden bg-background/40">
                <img
                  src={getRestoredUrl(image.restoredFile)}
                  alt={image.title}
                  loading="lazy"
                  className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.02]"
                />
              </div>

              <div className="p-4">
                <p className="text-sm font-medium text-primary">
                  {image.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Page {image.page}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {image.caption}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedImage && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 p-4 md:p-8"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="mx-auto flex h-full max-w-[96vw] flex-col overflow-hidden rounded-xl border border-white/10 bg-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-border/40 px-6 py-5">
              <div>
                <p className="text-xl font-semibold text-primary">
                  {selectedImage.title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Page {selectedImage.page} - Historical context image
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={!hasPrev}
                  className="rounded-md border border-border/50 px-3 py-2 text-sm text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                >
                <p>Previous</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedIndex(null)}
                  className="rounded-md border border-border/50 px-3 py-2 text-sm text-foreground transition hover:bg-muted"
                >
                <p>Close</p>
                </button>

                <button
                  type="button"
                  onClick={goNext}
                  disabled={!hasNext}
                  className="rounded-md border border-border/50 px-3 py-2 text-sm text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Next
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto p-6">
              <div className="grid gap-6 lg:grid-cols-[1.7fr_0.55fr]">
                <div className="rounded-lg border border-border/30 bg-background/40 p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      {viewMode === 'restored'
                        ? 'Restored exhibition image'
                        : 'Original source image'}
                    </p>

                    <div className="inline-flex rounded-md border border-border/50 bg-background/60 p-1">
                      <button
                        type="button"
                        onClick={() => setViewMode('original')}
                        className={`rounded px-3 py-1 text-xs transition ${
                          viewMode === 'original'
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        Original
                      </button>

                      <button
                        type="button"
                        onClick={() => setViewMode('restored')}
                        className={`rounded px-3 py-1 text-xs transition ${
                          viewMode === 'restored'
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        Restored
                      </button>
                    </div>
                  </div>

                  <img
                    src={
                      viewMode === 'restored'
                        ? getRestoredUrl(selectedImage.restoredFile)
                        : getOriginalUrl(selectedImage.originalFile)
                    }
                    alt={`${selectedImage.title} ${viewMode}`}
                    className="max-h-[82vh] w-full object-contain"
                  />

                  <p className="mt-3 text-xs leading-6 text-muted-foreground">
                    {viewMode === 'restored'
                      ? 'Restored view enhanced for legibility and exhibition presentation.'
                      : 'Original source image retained for reference and comparison.'}
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="rounded-lg border border-border/30 bg-background/40 p-4">
                    <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                      Context record
                    </p>

                    <div className="space-y-2 text-sm text-foreground">
                      <p>
                        <strong>Title:</strong> {selectedImage.title}
                      </p>
                      <p>
                        <strong>Page:</strong> {selectedImage.page}
                      </p>
                      <p>
                        <strong>Restored file:</strong> {selectedImage.restoredFile}
                      </p>
                      <p>
                        <strong>Original file:</strong> {selectedImage.originalFile}
                      </p>
                      <p>
                        <strong>Layer:</strong> Historical context / exhibition narrative
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border/30 bg-background/40 p-4">
                    <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                      Caption
                    </p>
                    <p className="text-sm leading-7 text-foreground">
                      {selectedImage.caption}
                    </p>
                  </div>

                  <div className="rounded-lg border border-border/30 bg-background/40 p-4">
                    <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                      Time-travel view
                    </p>
                    <p className="text-sm leading-7 text-muted-foreground">
                      Use the Original / Restored switch to compare the source image
                      with its restored exhibition version.
                    </p>
                  </div>

                  <div className="rounded-lg border border-border/30 bg-background/40 p-4">
                    <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                      Use in exhibition
                    </p>
                    <p className="text-sm leading-7 text-muted-foreground">
                      This image belongs to the context layer rather than the artifact layer.
                      It supports the historical atmosphere and narrative framing around
                      the 1897 expedition, dispersal, and modern reconstruction work.
                    </p>
                  </div>

                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    ESC to close - Use Previous / Next to browse
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
