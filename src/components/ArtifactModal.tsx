import { useEffect } from 'react';
import { type Artifact } from '@/data/artifacts';
import { ArtifactComparison } from '@/components/ArtifactComparison';
import { atlas } from '@/data/atlas';
import { verifiedMatches } from '@/data/verifiedMatches';
import { atlasOxfordLinks } from '@/data/atlasOxfordLinks';
import { oxfordAtlasSource } from '@/data/oxfordAtlasSource';

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
  const oxfordLink = atlasOxfordLinks.find((l) => l.artifactId === artifact.id);

  const oxfordEntry = oxfordLink?.accessionNumber
    ? oxfordAtlasSource.find((o) => o.accessionNumber === oxfordLink.accessionNumber)
    : null;

  const OXFORD_IMAGE_DIR = 'benin_output/atlas/oxford';

  const oxfordImageUrl = oxfordEntry?.imageFile
    ? `${import.meta.env.BASE_URL}${OXFORD_IMAGE_DIR}/${oxfordEntry.imageFile}`
    : null;

  const hasOxfordPanel = Boolean(atlasEntry || oxfordEntry || oxfordLink);

  const researchStatus = verifiedMatch
    ? verifiedMatch.verificationStatus === 'exact'
      ? 'Confirmed object-level match'
      : 'Probable object-level match'
    : atlasEntry
      ? 'Page-linked Oxford reference only'
      : 'No Oxford match status yet';

  const researchTitle = verifiedMatch?.verifiedTitle || null;
  const researchDescription = verifiedMatch?.verifiedDescription || null;
  const researchNote = verifiedMatch?.note || oxfordLink?.note || null;

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
          <div className="mt-4 rounded-lg bg-secondary/30 p-4">
            <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
              Historical Description
            </p>
            <p className="text-sm leading-relaxed text-foreground">
              {artifact.description}
            </p>
          </div>
        )}

        {(verifiedMatch || oxfordLink || atlasEntry) && (
          <div className="mt-4 rounded-lg bg-secondary/20 p-4 text-sm">
            <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
              Research Match Status
            </p>

            <p>
              <strong>Status:</strong> {researchStatus}
            </p>

            {researchTitle && (
              <p className="mt-2">
                <strong>Interpretation:</strong> {researchTitle}
              </p>
            )}

            {researchDescription && (
              <p className="mt-2">
                <strong>Research Description:</strong> {researchDescription}
              </p>
            )}

            {researchNote && (
              <p className="mt-2 text-muted-foreground">
                {researchNote}
              </p>
            )}
          </div>
        )}

        {hasOxfordPanel && (
          <div className="mt-4 rounded-lg bg-muted p-4 text-sm">
            <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
              Oxford Museum Record
            </p>

            {oxfordEntry ? (
              <p className="mb-3 text-xs text-muted-foreground">
                Accession-level Oxford museum record linked through the research cross-reference layer.
              </p>
            ) : atlasEntry ? (
              <p className="mb-3 text-xs text-muted-foreground">
                Oxford reference currently linked at page/figure level only. Object identity is not yet confirmed.
              </p>
            ) : (
              <p className="mb-3 text-xs text-muted-foreground">
                Oxford research note exists, but no linked museum accession has been confirmed yet.
              </p>
            )}

            {oxfordEntry && (
              <div className="rounded-md bg-background/40 p-3">
                {oxfordImageUrl && (
                  <div className="mb-4 overflow-hidden rounded-md border border-border/40 bg-background/40 p-2">
                    <img
                      src={oxfordImageUrl}
                      alt={`Oxford record ${oxfordEntry.accessionNumber}`}
                      loading="lazy"
                      className="max-h-[280px] w-full rounded object-contain"
                    />
                  </div>
                )}

                <p><strong>Accession:</strong> {oxfordEntry.accessionNumber}</p>

                {oxfordEntry.objectTitle && (
                  <p><strong>Title:</strong> {oxfordEntry.objectTitle}</p>
                )}

                {oxfordEntry.objectDescription && (
                  <p className="mt-2">
                    <strong>Description:</strong> {oxfordEntry.objectDescription}
                  </p>
                )}

                {oxfordEntry.sourceSection && (
                  <p className="mt-2"><strong>Section:</strong> {oxfordEntry.sourceSection}</p>
                )}

                {oxfordEntry.sourcePage !== null && (
                  <p><strong>Source page:</strong> {oxfordEntry.sourcePage}</p>
                )}

                {oxfordEntry.provenance && (
                  <p className="mt-2"><strong>Provenance:</strong> {oxfordEntry.provenance}</p>
                )}

                {oxfordEntry.provenanceDetail && (
                  <p className="mt-2">
                    <strong>Provenance detail:</strong> {oxfordEntry.provenanceDetail}
                  </p>
                )}

                {oxfordEntry.benin1897Status && (
                  <p className="mt-2"><strong>Status:</strong> {oxfordEntry.benin1897Status}</p>
                )}

                {/* {oxfordEntry.imageFile && (
                  <p><strong>Image file:</strong> {oxfordEntry.imageFile}</p>
                )} */}
              </div>
            )}

            {!oxfordEntry && atlasEntry && (
              <div className="rounded-md bg-background/40 p-3">
                <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                  Legacy page-linked record
                </p>

                {atlasEntry.accessionNumber && (
                  <p><strong>Accession:</strong> {atlasEntry.accessionNumber}</p>
                )}

                {atlasEntry.provenance && (
                  <p><strong>Provenance:</strong> {atlasEntry.provenance}</p>
                )}

                {atlasEntry.section && (
                  <p><strong>Section:</strong> {atlasEntry.section}</p>
                )}

                {atlasEntry.pageNumber !== null && (
                  <p><strong>Page:</strong> {atlasEntry.pageNumber}</p>
                )}

                {(atlasEntry.title || atlasEntry.description) && (
                  <div className="mt-3">
                    <p className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                      Catalog record
                    </p>

                    {atlasEntry.title && (
                      <p><strong>Title:</strong> {atlasEntry.title}</p>
                    )}

                    {atlasEntry.description && (
                      <p className="mt-2">
                        <strong>Description:</strong> {atlasEntry.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}