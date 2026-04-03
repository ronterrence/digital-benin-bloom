import { useState, useMemo } from 'react';
import { artifacts, type Artifact } from '@/data/artifacts';
import { useViewProgress } from '@/hooks/useViewProgress';
import { HeroSection } from '@/components/HeroSection';
import { MethodologySection } from '@/components/MethodologySection';
import { ClusterSection } from '@/components/ClusterSection';
import { ArtifactModal } from '@/components/ArtifactModal';
import { ProgressTracker } from '@/components/ProgressTracker';

const Index = () => {
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
      <HeroSection />
      <MethodologySection />

      <div id="gallery" className="pb-24">
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
};

export default Index;
