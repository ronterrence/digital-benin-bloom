type BMRow = {
  id: string;
  reg_number?: string | null;
  museum_number?: string | null;
  title?: string | null;
  description?: string | null;
  date?: string | null;
  acquisition_date?: string | null;
  material?: string | null;
  provenance?: string | null;
  production_place?: string | null;
  acquisition_notes?: string | null;
  associated_people?: string | null;
  dimensions?: string | null;
  museum_url?: string | null;
};

interface Props {
  row: BMRow | null;
  imageUrl: string | null;
  onClose: () => void;
}

export function BritishMuseumModal({ row, imageUrl, onClose }: Props) {
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
              {row. museum_number || row.reg_number || row.id }
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              British Museum record
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
                  alt={row. museum_number || row.reg_number || row.id}
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
                    <strong>Object number:</strong> {row. museum_number || row.reg_number || row.id }
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

                  {row.date && (
                    <p>
                      <strong>Date:</strong> {row.date}
                    </p>
                  )}

                  {row.acquisition_date && (
                    <p>
                      <strong>Acquisition date:</strong> {row.acquisition_date}
                    </p>
                  )}

                  {row.material && (
                    <p>
                      <strong>Material:</strong> {row.material}
                    </p>
                  )}

                  {row.dimensions && (
                    <p>
                      <strong>Dimensions:</strong> {row.dimensions}
                    </p>
                  )}
                </div>
              </div>

              {(row.provenance || row.acquisition_notes || row.associated_people || row.production_place) && (
                <div className="rounded-lg border border-border/30 bg-background/40 p-4">
                  <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                    Context
                  </p>

                  <div className="space-y-2 text-sm text-foreground">
                    {row.provenance && (
                      <p>
                        <strong>Provenance:</strong> {row.provenance}
                      </p>
                    )}

                    {row.acquisition_notes && (
                      <p>
                        <strong>Acquisition notes:</strong> {row.acquisition_notes}
                      </p>
                    )}

                    {row.associated_people && (
                      <p>
                        <strong>Associated people:</strong> {row.associated_people}
                      </p>
                    )}

                    {row.production_place && (
                      <p>
                        <strong>Production place:</strong> {row.production_place}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {row.museum_url && (
                <div className="rounded-lg border border-border/30 bg-background/40 p-4">
                  <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                    Source
                  </p>
                  <a
                    href={row.museum_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    Open British Museum record
                  </a>
                  <p className="mt-3 text-xs leading-6 text-muted-foreground">
                    Image credit: © The Trustees of the British Museum. Shared under a Creative
                    Commons Attribution-NonCommercial-ShareAlike 4.0 International licence.
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