type MetRow = {
  id: string;
  object_id: number;
  accession_number?: string | null;
  title?: string | null;
  object_name?: string | null;
  culture?: string | null;
  object_date?: string | null;
  medium?: string | null;
  country?: string | null;
  region?: string | null;
  gallery_number?: string | null;
  is_public_domain?: boolean;
};

interface Props {
  row: MetRow;
  imageUrl: string | null;
  onClick: () => void;
}

export function MetMuseumCard({ row, imageUrl, onClick }: Props) {
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
            alt={row.title || row.accession_number || row.id}
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
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium text-primary">
            {row.accession_number || row.id}
          </p>

          {row.is_public_domain && (
            <span className="rounded-full border border-primary/30 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">
              Public Domain
            </span>
          )}
        </div>

        {row.title && (
          <p className="mt-2 line-clamp-2 text-sm font-medium text-foreground">
            {row.title}
          </p>
        )}

        {row.object_name && (
          <p className="mt-1 text-xs text-muted-foreground">
            {row.object_name}
          </p>
        )}

        <div className="mt-3 space-y-1 text-xs text-muted-foreground">
          {row.culture && <p>Culture: {row.culture}</p>}
          {row.object_date && <p>Date: {row.object_date}</p>}
          {row.medium && <p className="line-clamp-1">Medium: {row.medium}</p>}
          {row.gallery_number && <p>Gallery {row.gallery_number}</p>}
        </div>
      </div>
    </button>
  );
}