import { Eye, RotateCcw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { TOTAL_CLUSTERS, clusterNames } from '@/data/artifacts';
import { Button } from '@/components/ui/button';

interface Props {
  viewedCount: number;
  totalCount: number;
  percentage: number;
  viewedClusters: Set<number>;
  onReset: () => void;
}

export function ProgressTracker({ viewedCount, totalCount, percentage, viewedClusters, onReset }: Props) {
  return (
    <div className="fixed bottom-6 right-6 z-40 w-64 rounded-xl border border-border/50 bg-card/90 p-4 shadow-2xl backdrop-blur-md">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-foreground">Progress</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-foreground"
          onClick={onReset}
        >
          <RotateCcw className="h-3 w-3" />
        </Button>
      </div>

      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-2xl font-bold text-primary">{percentage}%</span>
        <span className="text-[10px] text-muted-foreground">
          {viewedCount} / {totalCount}
        </span>
      </div>
      <Progress value={percentage} className="mb-4 h-1.5 bg-secondary" />

      <div className="grid grid-cols-6 gap-1">
        {Array.from({ length: TOTAL_CLUSTERS }, (_, i) => (
          <button
            key={i}
            onClick={() => document.getElementById(`cluster-${i}`)?.scrollIntoView({ behavior: 'smooth' })}
            className={`flex h-7 w-full items-center justify-center rounded text-[9px] font-medium transition-colors ${
              viewedClusters.has(i)
                ? 'bg-primary/20 text-primary'
                : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
            }`}
            title={clusterNames[i]}
          >
            {String(i).padStart(2, '0')}
          </button>
        ))}
      </div>
    </div>
  );
}
