type SMBRow = {
  id: string;
  object_id: number;
  title?: string | null;
  inventory_number?: string | null;
  institution?: string | null;
  description?: string | null;
  dating?: string | null;
  production_place?: string | null;
  collector?: string | null;
  material?: string | null;
  rights?: string | null;
};

interface Props {
  row: SMBRow;
  imageUrl: string | null;
  onClick: () => void;
}

export function SMBCard({ row, imageUrl, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group overflow-hidden rounded-xl border border-border/30 bg-card/40 text-left transition hover:border-primary/30 hover:shadow-[0_0_24px_-12px_hsl(43_52%_54%_/_0.25)]"
    >
      <div className="aspect-[4/3] overflow-hidden bg-background/40">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={row.title || row.inventory_number || row.id}
            loading="lazy"
            className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-sm font-medium text-primary">
          {row.inventory_number || row.id}
        </p>

        {row.title && (
          <p className="mt-2 line-clamp-2 text-sm font-medium text-foreground">
            {row.title}
          </p>
        )}

        <div className="mt-3 space-y-1 text-xs text-muted-foreground">
          {row.institution && <p>{row.institution}</p>}
          {row.production_place && <p>Place: {row.production_place}</p>}
          {row.dating && <p>Date: {row.dating}</p>}
          {row.material && <p className="line-clamp-1">Material: {row.material}</p>}
          {row.rights && <p>Rights: {row.rights}</p>}
        </div>
      </div>
    </button>
  );
}