type MetRow = {
  id: string;
  object_id: number;
  accession_number?: string | null;
  accession_year?: string | null;
  title?: string | null;
  object_name?: string | null;
  department?: string | null;
  culture?: string | null;
  period?: string | null;
  object_date?: string | null;
  object_begin_date?: number | null;
  object_end_date?: number | null;
  medium?: string | null;
  dimensions?: string | null;
  country?: string | null;
  region?: string | null;
  classification?: string | null;
  credit_line?: string | null;
  repository?: string | null;
  gallery_number?: string | null;
  is_public_domain?: boolean;
  rights_and_reproduction?: string | null;
  object_url?: string | null;
  object_wikidata_url?: string | null;
  image_file?: string | null;
  tags?: string | null;
  metadata_date?: string | null;
};

interface Props {
  row: MetRow | null;
  imageUrl: string | null;
  onClose: () => void;
}

export function MetMuseumModal({ row, imageUrl, onClose }: Props) {
  if (!row) return null;

  return (
    <div
  className="fixed inset-0 z-[100] bg-black/90 p-4 md:p-8"
  onClick={onClose}
>
  <div
    className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-xl border border-white/10 bg-card"
    onClick={(e) => e.stopPropagation()}
  >
    <div className="flex items-start justify-between gap-4 border-b border-border/40 px-6 py-5">
      <div>
        <p className="text-xl font-semibold text-primary">
          {row.accession_number || row.id}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Metropolitan Museum of Art record
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="rounded-md border border-border/50 px-3 py-2 text-sm text-foreground transition hover:bg-muted"
      >
        Close
      </button>
    </div>

    <div className="min-h-0 flex-1 overflow-auto p-6">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-border/30 bg-background/40 p-4">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={row.title || row.accession_number || row.id}
              className="max-h-[70vh] w-full object-contain"
            />
          ) : (
            <div className="flex h-[40vh] items-center justify-center text-sm text-muted-foreground">
              No image available
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="rounded-lg border border-border/30 bg-background/40 p-4">
            <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
              Record
            </p>

            <div className="space-y-2 text-sm text-foreground">
              <p>
                <strong>Object ID:</strong> {row.object_id}
              </p>

              {row.accession_number && (
                <p>
                  <strong>Accession:</strong> {row.accession_number}
                </p>
              )}

              {row.title && (
                <p>
                  <strong>Title:</strong> {row.title}
                </p>
              )}

              {row.object_name && (
                <p>
                  <strong>Object name:</strong> {row.object_name}
                </p>
              )}

              {row.object_date && (
                <p>
                  <strong>Date:</strong> {row.object_date}
                </p>
              )}

              {row.medium && (
                <p>
                  <strong>Medium:</strong> {row.medium}
                </p>
              )}

              {row.dimensions && (
                <p>
                  <strong>Dimensions:</strong> {row.dimensions}
                </p>
              )}

              {row.culture && (
                <p>
                  <strong>Culture:</strong> {row.culture}
                </p>
              )}

              {row.country && (
                <p>
                  <strong>Country:</strong> {row.country}
                </p>
              )}

              {row.region && (
                <p>
                  <strong>Region:</strong> {row.region}
                </p>
              )}

              {row.gallery_number && (
                <p>
                  <strong>Gallery:</strong> {row.gallery_number}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-border/30 bg-background/40 p-4">
            <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
              Source / Rights
            </p>

            <div className="space-y-2 text-sm text-foreground">
              {row.repository && (
                <p>
                  <strong>Repository:</strong> {row.repository}
                </p>
              )}

              {row.credit_line && (
                <p>
                  <strong>Credit line:</strong> {row.credit_line}
                </p>
              )}

              <p>
                <strong>Rights:</strong>{' '}
                {row.is_public_domain ? 'Public Domain / Open Access' : 'Check Met record'}
              </p>

              {row.object_url && (
                <a
                  href={row.object_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block text-primary underline-offset-4 hover:underline"
                >
                  Open Met record
                </a>
              )}
            </div>
          </div>

          {row.tags && (
            <div className="rounded-lg border border-border/30 bg-background/40 p-4">
              <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                Tags
              </p>
              <p className="text-sm leading-7 text-muted-foreground">
                {row.tags}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
</div>
  );
}