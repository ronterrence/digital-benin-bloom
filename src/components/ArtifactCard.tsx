import { useEffect, useRef, useState } from 'react';
import { type Artifact, mapArtifactImages } from '@/data/artifacts';
import { atlas } from '@/data/atlas';

interface Props {
  artifact: Artifact;
  onView: (id: string, cluster: number) => void;
  onClick: () => void;
  isViewed: boolean;
}

export function ArtifactCard({ artifact, onView, onClick, isViewed }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const images = mapArtifactImages(artifact);
  const atlasEntry = atlas.find((a) => a.id === artifact.id);
  const hasAtlasMatch = !!atlasEntry;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          onView(artifact.id, artifact.cluster);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [artifact.id, artifact.cluster, onView]);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`group cursor-pointer overflow-hidden rounded-lg border border-border/30 bg-card/40 transition-all duration-500 hover:border-primary/40 hover:shadow-[0_0_30px_-10px_hsl(43_52%_54%_/_0.2)] ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={images.original}
          alt={artifact.id}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {hasAtlasMatch && (
          <div className="absolute left-2 top-2 rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
            Atlas Match
          </div>
        )}
        

        {isViewed && (
          <div className="absolute right-2 top-2 rounded-full bg-primary/80 px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
            Viewed
          </div>
        )}
      </div>

      <div className="p-3">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">
          {artifact.id.replace('_', ' ')}
        </p>
        {artifact.description && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {artifact.description}
          </p>
        )}
      </div>
    </div>
  );
}