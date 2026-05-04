type BMRow = {
  id: string;
  reg_number?: string | null;
  museum_number?: string | null;
  title?: string | null;
  object_type?: string | null;
  date?: string | null;
  materials?: string | null;
  description?: string | null;
  acquisition_date?: string | null;
  expedition_note?: string | null;
};

interface Props {
  row: BMRow;
  imageUrl: string | null;
  onClick: () => void;
}

export function BritishMuseumCard({ row, imageUrl, onClick }: Props) {
  const displayNumber = row.museum_number || row.reg_number || row.id;

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
            alt={displayNumber}
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
          {displayNumber}
        </p>

        {row.title && (
          <p className="mt-2 line-clamp-2 text-sm font-medium text-foreground">
            {row.title}
          </p>
        )}

        {row.object_type && (
          <p className="mt-1 text-xs text-muted-foreground">
            {row.object_type}
          </p>
        )}

        {row.description && (
          <p className="mt-2 line-clamp-3 text-xs leading-6 text-muted-foreground">
            {row.description}
          </p>
        )}

        <div className="mt-3 space-y-1 text-xs text-muted-foreground">
          {row.date && <p>Date: {row.date}</p>}
          {row.acquisition_date && <p>Acquired: {row.acquisition_date}</p>}
          {row.materials && <p className="line-clamp-1">Materials: {row.materials}</p>}
        </div>

        {row.expedition_note && (
          <p className="mt-3 rounded-md bg-secondary/20 p-2 text-xs text-muted-foreground">
            {row.expedition_note}
          </p>
        )}
      </div>
    </button>
  );
}