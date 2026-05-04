import { useEffect } from 'react';
import { type Artifact } from '@/data/artifacts';
import { ArtifactComparison } from '@/components/ArtifactComparison';
import { atlas } from '@/data/atlas';
import { verifiedMatches } from '@/data/verifiedMatches';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface Props {
  artifact: Artifact | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export function ArtifactModal({
  artifact,
  open,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
  onOpenChange,
}: Props) {
  if (!artifact) return null;

  const atlasEntry = atlas.find((a) => a.id === artifact.id);
  const verifiedMatch = verifiedMatches.find((m) => m.id === artifact.id);

  const researchStatus = verifiedMatch
    ? verifiedMatch.verificationStatus === 'exact'
      ? 'Confirmed object-level match'
      : 'Probable object-level match'
    : atlasEntry
      ? 'Page-linked reference only'
      : 'No research match status yet';

  const researchTitle = verifiedMatch?.verifiedTitle || null;
  const researchDescription = verifiedMatch?.verifiedDescription || null;
  const researchNote = verifiedMatch?.note || null;

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft' && hasPrev) {
        e.preventDefault();
        onPrev?.();
      }

      if (e.key === 'ArrowRight' && hasNext) {
        e.preventDefault();
        onNext?.();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, hasPrev, hasNext, onPrev, onNext]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto border-border/50 bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl text-primary">
            {artifact.id.replace('_', ' ').toUpperCase()}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Cluster {String(artifact.cluster).padStart(2, '0')}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <ArtifactComparison artifact={artifact} />
        </div>

        {(hasPrev || hasNext) && (
          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPrev?.();
              }}
              disabled={!hasPrev}
              className="rounded-md border border-border/50 px-3 py-2 text-sm text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Previous
            </button>

            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Quick browse
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNext?.();
              }}
              disabled={!hasNext}
              className="rounded-md border border-border/50 px-3 py-2 text-sm text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        )}

        {artifact.description && (
          <>
            <div className="mt-4 rounded-lg bg-secondary/30 p-4">
              <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                Historical Description
              </p>
              <p className="text-sm leading-relaxed text-foreground">
                {artifact.description}
              </p>
            </div>
            <div className="mt-4 rounded-lg bg-secondary/20 p-4 text-sm">
              <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                Source Context (Pitts Collection)
              </p>
              <p><strong>Collection:</strong> Works of Art from Benin</p>
              <p><strong>Publication:</strong> Pitt-Rivers, April 1900</p>
              <p>
                <strong>Acquisition context:</strong> Objects obtained during the 1897 British punitive expedition.
              </p>
              <p className="text-muted-foreground mt-2">
                These images originate from a 1900 publication documenting objects taken in 1897.
                Their exact identities are being reconstructed through cross-referencing with contemporary museum records.
              </p>
            </div>
          </>
        )}

        {verifiedMatch && (
        <div className="mt-4 rounded-lg bg-secondary/10 p-4 text-sm">
          <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
            Located / Interpretive Match
          </p>

          <p>
            <strong>Status:</strong>{' '}
            {verifiedMatch.verificationStatus === 'exact'
              ? 'Located match'
              : 'Probable located match'}
          </p>

          {researchTitle && (
            <p className="mt-2">
              <strong>Interpretation:</strong> {researchTitle}
            </p>
          )}

          {researchNote && (
            <p className="mt-2 text-muted-foreground">
              {researchNote}
            </p>
          )}
        </div>
      )}

      </DialogContent>
    </Dialog>
  );
}