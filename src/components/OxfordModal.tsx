type OxfordHoldingRow = {
  accession_number: string;
  title?: string | null;
  description?: string | null;
  section?: string | null;
  page_number?: number | null;
  source_page?: number | null;
  primary_image_file?: string | null;
  image_status?: string | null;
  status?: string | null;
  provenance?: string | null;
  provenance_detail?: string | null;
  publication_notes?: string | null;
};

interface Props {
  row: OxfordHoldingRow | null;
  imageUrl: string | null;
  onClose: () => void;
}

export function OxfordModal({ row, imageUrl, onClose }: Props) {
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
              {row.accession_number}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Oxford museum record
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
                  alt={row.accession_number}
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
                    <strong>Accession:</strong> {row.accession_number}
                  </p>

                  {row.title && (
                    <p>
                      <strong>Title:</strong> {row.title}
                    </p>
                  )}

                  {row.description && (
                    <p>
                      <strong>Description:</strong> {row.description}
                    </p>
                  )}

                  {row.section && (
                    <p>
                      <strong>Section:</strong> {row.section}
                    </p>
                  )}

                  {row.source_page != null && (
                    <p>
                      <strong>Source page:</strong> {row.source_page}
                    </p>
                  )}

                  {row.status && (
                    <p>
                      <strong>Status:</strong> {row.status}
                    </p>
                  )}
                </div>
              </div>

              {(row.provenance || row.provenance_detail) && (
                <div className="rounded-lg border border-border/30 bg-background/40 p-4">
                  <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                    Provenance
                  </p>

                  <div className="space-y-2 text-sm text-foreground">
                    {row.provenance && (
                      <p>
                        <strong>Provenance:</strong> {row.provenance}
                      </p>
                    )}

                    {row.provenance_detail && (
                      <p>
                        <strong>Provenance detail:</strong> {row.provenance_detail}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {row.publication_notes && (
                <div className="rounded-lg border border-border/30 bg-background/40 p-4">
                  <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                    Publication notes
                  </p>
                  <p className="text-sm leading-7 text-foreground">
                    {row.publication_notes}
                  </p>
                </div>
              )}

              {row.primary_image_file && (
                <div className="rounded-lg border border-border/30 bg-background/40 p-4">
                  <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                    Image asset
                  </p>
                  <p className="text-sm text-foreground">
                    {row.primary_image_file}
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