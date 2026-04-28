import { useMemo, useState } from 'react';
import artifactMapLayout from '../data/normalized/artifact_map_layout.json';
import { artifacts, type Artifact } from '@/data/artifacts';
import { ArtifactModal } from '@/components/ArtifactModal';
import { Link } from 'react-router-dom';

type LayoutPoint = {
  id: string;
  x: number;
  y: number;
};

const CLUSTER_COLORS: Record<number, string> = {
  0: '#C9A227',
  1: '#D97706',
  2: '#059669',
  3: '#7C3AED',
  4: '#2563EB',
  5: '#DC2626',
  6: '#9333EA',
  7: '#0F766E',
  8: '#CA8A04',
  9: '#BE123C',
  10: '#4F46E5',
  11: '#15803D',
};

const SVG_WIDTH = 1200;
const SVG_HEIGHT = 900;
const PADDING = 50;

export default function MapPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(false);

  const points = useMemo(() => {
    const artifactMap = new Map(artifacts.map((a) => [a.id, a]));

    const joined = (artifactMapLayout as LayoutPoint[])
      .map((point) => {
        const artifact = artifactMap.get(point.id);
        if (!artifact) return null;
        return {
          ...point,
          artifact,
        };
      })
      .filter(Boolean) as Array<LayoutPoint & { artifact: Artifact }>;

    return joined;
  }, []);

    const clustersInMap = useMemo(() => {
  return Array.from(new Set(points.map((p) => p.artifact.cluster))).sort((a, b) => a - b);
    }, [points]);

  const selectedArtifact =
    selectedIndex !== null ? points[selectedIndex]?.artifact ?? null : null;

  const hoveredPoint = hoveredId
    ? points.find((p) => p.id === hoveredId) ?? null
    : null;

  const projectX = (x: number) => PADDING + x * (SVG_WIDTH - PADDING * 2);
  const projectY = (y: number) => PADDING + (1 - y) * (SVG_HEIGHT - PADDING * 2);

  const goPrev = () => {
    setSelectedIndex((prev) => {
      if (prev === null || prev <= 0) return prev;
      return prev - 1;
    });
  };

  const goNext = () => {
    setSelectedIndex((prev) => {
      if (prev === null || prev >= points.length - 1) return prev;
      return prev + 1;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-10">
        <div className="text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-muted-foreground">
            Map
          </p>

          <h1 className="text-4xl font-semibold md:text-5xl text-gold">
            Mike Pitts Artifact Map
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
            A 2D visual map of the Pitts image set. Nearby points are visually more similar
            based on image embeddings. Click any point to inspect the artifact.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowLabels((prev) => !prev)}
              className="rounded-md border border-primary/40 px-4 py-2 text-sm text-primary transition hover:bg-primary/10"
            >
              {showLabels ? 'Hide labels' : 'Show labels'}
            </button>

            <Link
              to="/archive"
              className="rounded-md border border-border/50 px-4 py-2 text-sm text-foreground transition hover:bg-muted"
            >
              Back to archive
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="rounded-xl border border-border/40 bg-card/40 p-3 md:p-4">
            <div className="overflow-hidden rounded-lg border border-border/30 bg-background/50">
              <svg
                viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
                className="h-[72vh] w-full"
                role="img"
                aria-label="Artifact similarity map"
              >
                <rect
                  x="0"
                  y="0"
                  width={SVG_WIDTH}
                  height={SVG_HEIGHT}
                  fill="transparent"
                />

                {points.map((point, index) => {
                  const cx = projectX(point.x);
                  const cy = projectY(point.y);
                  const isHovered = hoveredId === point.id;
                  const isSelected = selectedArtifact?.id === point.id;
                  const color = CLUSTER_COLORS[point.artifact.cluster] ?? '#C9A227';

                  return (
                    <g key={point.id}>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isSelected ? 10 : isHovered ? 8 : 6}
                        fill={color}
                        opacity={isSelected ? 1 : 0.88}
                        stroke={isSelected ? '#ffffff' : 'rgba(255,255,255,0.35)'}
                        strokeWidth={isSelected ? 2.5 : 1}
                        className="cursor-pointer transition-all duration-150"
                        onMouseEnter={() => setHoveredId(point.id)}
                        onMouseLeave={() => setHoveredId((prev) => (prev === point.id ? null : prev))}
                        onClick={() => setSelectedIndex(index)}
                      />

                      {(showLabels || isHovered || isSelected) && (
                        <text
                          x={cx + 10}
                          y={cy - 10}
                          fontSize="12"
                          fill="currentColor"
                          className="fill-foreground"
                        >
                          {point.id.replace('_', ' ')}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <aside className="rounded-xl border border-border/40 bg-card/40 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Overview
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Total Pitts artifacts on map: <span className="text-foreground">{points.length}</span>
            </p>

            {hoveredPoint ? (
              <div className="mt-5 rounded-lg border border-border/30 bg-background/40 p-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Hovered point
                </p>
                <p className="mt-2 text-sm font-medium text-primary">
                  {hoveredPoint.id.replace('_', ' ').toUpperCase()}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Cluster {String(hoveredPoint.artifact.cluster).padStart(2, '0')} 
                </p>
                {hoveredPoint.artifact.description && (
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {hoveredPoint.artifact.description}
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-5 rounded-lg border border-border/30 bg-background/40 p-4">
                <p className="text-sm text-muted-foreground">
                  Hover over a point to preview its figure and description.
                </p>
              </div>
            )}

            <div className="mt-6">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Clusters
              </p>

              <div className="mt-3 space-y-2">
                {clustersInMap.map((cluster) => (
                <div key={cluster} className="flex items-center gap-3 text-sm">
                    <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: CLUSTER_COLORS[cluster] ?? '#C9A227' }}
                    />
                    <span className="text-muted-foreground">
                    Cluster {String(cluster).padStart(2, '0')}
                    </span>
                </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <ArtifactModal
        artifact={selectedArtifact}
        open={!!selectedArtifact}
        onOpenChange={(open) => {
          if (!open) setSelectedIndex(null);
        }}
        onPrev={goPrev}
        onNext={goNext}
        hasPrev={selectedIndex !== null && selectedIndex > 0}
        hasNext={selectedIndex !== null && selectedIndex < points.length - 1}
      />
    </div>
  );
}