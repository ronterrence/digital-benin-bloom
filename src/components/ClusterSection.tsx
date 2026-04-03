import { useEffect, useRef, useState } from 'react';
import { type Artifact, clusterNames } from '@/data/artifacts';
import { ArtifactCard } from './ArtifactCard';

interface Props {
  cluster: number;
  artifacts: Artifact[];
  onView: (id: string, cluster: number) => void;
  onArtifactClick: (artifact: Artifact) => void;
  viewedArtifacts: Set<string>;
}

export function ClusterSection({ cluster, artifacts, onView, onArtifactClick, viewedArtifacts }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const viewedCount = artifacts.filter(a => viewedArtifacts.has(a.id)).length;

  return (
    <section
      ref={ref}
      id={`cluster-${cluster}`}
      className={`px-6 py-16 transition-all duration-700 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-baseline gap-4">
          <h2 className="text-2xl font-semibold text-primary md:text-3xl">
            Cluster {String(cluster).padStart(2, '0')}
          </h2>
          <span className="text-sm text-muted-foreground">
            {clusterNames[cluster]}
          </span>
          <span className="ml-auto text-xs text-muted-foreground">
            {viewedCount}/{artifacts.length} viewed
          </span>
        </div>
        <div className="h-px bg-gradient-to-r from-primary/40 via-primary/10 to-transparent mb-8" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {artifacts.map(artifact => (
            <ArtifactCard
              key={artifact.id}
              artifact={artifact}
              onView={onView}
              onClick={() => onArtifactClick(artifact)}
              isViewed={viewedArtifacts.has(artifact.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
