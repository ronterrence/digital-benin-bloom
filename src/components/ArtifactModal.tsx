import { type Artifact, clusterNames } from '@/data/artifacts';
import { ArtifactComparison } from '@/components/ArtifactComparison';
import { atlas } from '@/data/atlas';

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

        {atlasEntry?.oxford && (
          <div className="mt-4 rounded-lg bg-muted p-4 text-sm">
            <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
              Oxford Collection Match
            </p>

            <p><strong>Object:</strong> {atlasEntry.oxford.objectType}</p>
            <p><strong>Collection:</strong> {atlasEntry.oxford.collection}</p>
            <p><strong>Date:</strong> {atlasEntry.oxford.acquisitionDate}</p>
            <p><strong>Location:</strong> {atlasEntry.oxford.location}</p>

            {atlasEntry.oxford.notes && (
              <p className="mt-2 text-muted-foreground">
                {atlasEntry.oxford.notes}
              </p>
            )}

            <p className="mt-2 text-xs text-muted-foreground">
              Confidence: {(atlasEntry.confidence * 100).toFixed(0)}%
            </p>
          </div>
        )}
		{atlasEntry?.metadata && (
		  <div className="mt-3 text-xs text-muted-foreground">
			<p><strong>Period:</strong> {atlasEntry.metadata.period}</p>
			<p><strong>Event:</strong> {atlasEntry.metadata.event}</p>
			<p><strong>Origin:</strong> {atlasEntry.metadata.origin}</p>
		  </div>
		)}
      </DialogContent>
    </Dialog>
  );
}