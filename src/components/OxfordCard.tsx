type OxfordHoldingRow = {
  accession_number: string;
  title?: string | null;
  description?: string | null;
  section?: string | null;
  source_page?: number | null;
  primary_image_file?: string | null;
  status?: string | null;
  provenance?: string | null;
};

interface Props {
  row: OxfordHoldingRow;
  imageUrl: string | null;
  onClick: () => void;
}

export function OxfordCard({ row, imageUrl, onClick }: Props) {
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
            alt={row.accession_number}
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
            {row.accession_number}
          </p>

          {row.status === 'confirmed_1897' && (
            <span className="rounded-full border border-primary/30 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">
              Confirmed 1897
            </span>
          )}
        </div>

        {row.title && (
          <p className="mt-2 line-clamp-2 text-sm font-medium text-foreground">
            {row.title}
          </p>
        )}

        {row.description && (
          <p className="mt-2 line-clamp-3 text-xs leading-6 text-muted-foreground">
            {row.description}
          </p>
        )}

        <div className="mt-3 space-y-1 text-xs text-muted-foreground">
          {row.section && <p>Section {row.section}</p>}
          {row.source_page != null && <p>Source page {row.source_page}</p>}
          {row.provenance && <p className="line-clamp-2">{row.provenance}</p>}
        </div>
      </div>
    </button>
  );
}