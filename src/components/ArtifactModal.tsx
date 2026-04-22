import { type Artifact, clusterNames } from '@/data/artifacts';
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
}

export function ArtifactModal({ artifact, open, onOpenChange }: Props) {
  if (!artifact) return null;

  const atlasEntry = atlas.find((a) => a.id === artifact.id);
  const verifiedMatch = verifiedMatches.find((m) => m.id === artifact.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto border-border/50 bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl text-primary">
            {artifact.id.replace('_', ' ').toUpperCase()}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Cluster {String(artifact.cluster).padStart(2, '0')} — {clusterNames[artifact.cluster]}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <ArtifactComparison artifact={artifact} />
        </div>

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

        {atlasEntry && (
          <div className="mt-4 rounded-lg bg-muted p-4 text-sm">
            <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
              Oxford Page Link
            </p>

            <p className="mb-2 text-xs text-muted-foreground">
              Linked catalog record associated by figure/page number. Object identity not yet verified.
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
                  Catalog Record
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

        {verifiedMatch && (
          <div className="mt-4 rounded-lg bg-secondary/20 p-4 text-sm">
            <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
              Verified Object Match
            </p>

            <p className="mb-2 text-xs text-muted-foreground">
              Curated object-level interpretation based on the depicted artifact.
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {verifiedMatch.verificationStatus === "exact" ? "Exact" : "Probable"}
            </p>

            <p>
              <strong>Title:</strong> {verifiedMatch.verifiedTitle}
            </p>

            {verifiedMatch.verifiedDescription && (
              <p className="mt-2">
                <strong>Description:</strong> {verifiedMatch.verifiedDescription}
              </p>
            )}

            {verifiedMatch.note && (
              <p className="mt-2 text-muted-foreground">
                {verifiedMatch.note}
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}