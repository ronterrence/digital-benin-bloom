import { useState, useMemo } from 'react';
import { artifacts, type Artifact } from '@/data/artifacts';
import { useViewProgress } from '@/hooks/useViewProgress';
import { MethodologySection } from '@/components/MethodologySection';
import { ClusterSection } from '@/components/ClusterSection';
import { ArtifactModal } from '@/components/ArtifactModal';
import { ProgressTracker } from '@/components/ProgressTracker';
import { Link } from "react-router-dom";


export default function ArchivePage() {
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const progress = useViewProgress();

  const clusteredArtifacts = useMemo(() => {
    const map = new Map<number, Artifact[]>();

    for (const a of artifacts) {
      const list = map.get(a.cluster) || [];
      list.push(a);
      map.set(a.cluster, list);
    }

    return Array.from(map.entries()).sort(([a], [b]) => a - b);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 pt-24 pb-12 text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.25em] text-muted-foreground">
          Archive
        </p>
        <h1 className="text-4xl font-semibold md:text-5xl text-gold">
          Object Clusters
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
          Explore artifacts grouped by visual and thematic relationships, alongside
          the reconstruction process used to recover details from the original printed plates.
        </p>
      </div>
      <MethodologySection />

      <div className="pb-24">
        {clusteredArtifacts.map(([cluster, arts]) => (
          <ClusterSection
            key={cluster}
            cluster={cluster}
            artifacts={arts}
            onView={progress.markViewed}
            onArtifactClick={setSelectedArtifact}
            viewedArtifacts={progress.viewedArtifacts}
          />
        ))}
      </div>
	  
	  <div className="mt-20 text-center">
	  <p className="mx-auto max-w-2xl text-sm italic text-muted-foreground mb-4">
		These objects were once part of a living kingdom. Their presence here is tied to
		the events of 1897 — explored further in the audio narratives.
	  </p>
	  <Link
		to="/audio"
		className="inline-block mt-2 text-gold font-medium tracking-wide hover:opacity-80 transition">
		Listen to the narrative →
	  </Link>
	  </div>

      <ArtifactModal
        artifact={selectedArtifact}
        open={!!selectedArtifact}
        onOpenChange={(open) => !open && setSelectedArtifact(null)}
      />

      <ProgressTracker
        viewedCount={progress.viewedArtifacts.size}
        totalCount={progress.totalArtifacts}
        percentage={progress.percentage}
        viewedClusters={progress.viewedClusters}
        onReset={progress.resetProgress}
      />
    </div>
  );
}