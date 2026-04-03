import { type Artifact, IMAGE_BASE_URL, clusterNames } from '@/data/artifacts';
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-border/50 bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl text-primary">
            {artifact.id.replace('_', ' ').toUpperCase()}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Cluster {String(artifact.cluster).padStart(2, '0')} — {clusterNames[artifact.cluster]}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 overflow-hidden rounded-lg">
          <img
            src={`${IMAGE_BASE_URL}${artifact.mainImage}`}
            alt={artifact.id}
            className="w-full object-contain"
          />
        </div>

        {artifact.hasPair && (
          <div className="mt-3 overflow-hidden rounded-lg">
            <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Enhanced Detail</p>
            <img
              src={`${IMAGE_BASE_URL}${artifact.detailImage}`}
              alt={`${artifact.id} detail`}
              className="w-full object-contain"
            />
          </div>
        )}

        {artifact.description && (
          <div className="mt-4 rounded-lg bg-secondary/30 p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Historical Description</p>
            <p className="text-sm leading-relaxed text-foreground">
              {artifact.description}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
