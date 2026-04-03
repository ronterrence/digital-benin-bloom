import { useState, useEffect, useCallback, useRef } from 'react';
import { TOTAL_ARTIFACTS, TOTAL_CLUSTERS } from '@/data/artifacts';

const STORAGE_KEY = 'benin-exhibition-progress';

interface ViewProgress {
  viewedArtifacts: Set<string>;
  viewedClusters: Set<number>;
  totalArtifacts: number;
  totalClusters: number;
  percentage: number;
  markViewed: (artifactId: string, cluster: number) => void;
  resetProgress: () => void;
}

function loadProgress(): { artifacts: string[]; clusters: number[] } {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { artifacts: [], clusters: [] };
}

export function useViewProgress(): ViewProgress {
  const [viewedArtifacts, setViewedArtifacts] = useState<Set<string>>(() => {
    const { artifacts } = loadProgress();
    return new Set(artifacts);
  });
  const [viewedClusters, setViewedClusters] = useState<Set<number>>(() => {
    const { clusters } = loadProgress();
    return new Set(clusters);
  });

  const viewedRef = useRef(viewedArtifacts);
  const clustersRef = useRef(viewedClusters);

  useEffect(() => {
    viewedRef.current = viewedArtifacts;
    clustersRef.current = viewedClusters;
  }, [viewedArtifacts, viewedClusters]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      artifacts: Array.from(viewedArtifacts),
      clusters: Array.from(viewedClusters),
    }));
  }, [viewedArtifacts, viewedClusters]);

  const markViewed = useCallback((artifactId: string, cluster: number) => {
    if (!viewedRef.current.has(artifactId)) {
      setViewedArtifacts(prev => new Set(prev).add(artifactId));
    }
    if (!clustersRef.current.has(cluster)) {
      setViewedClusters(prev => new Set(prev).add(cluster));
    }
  }, []);

  const resetProgress = useCallback(() => {
    setViewedArtifacts(new Set());
    setViewedClusters(new Set());
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    viewedArtifacts,
    viewedClusters,
    totalArtifacts: TOTAL_ARTIFACTS,
    totalClusters: TOTAL_CLUSTERS,
    percentage: Math.round((viewedArtifacts.size / TOTAL_ARTIFACTS) * 100),
    markViewed,
    resetProgress,
  };
}
