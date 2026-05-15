type SMBRawImage = {
  owner?: string;
  creator?: string;
  rights?: string;
};

type SMBRawRecord = {
  object_images?: SMBRawImage[];
  licence?: {
    metadata_rights_holder?: string;
    metadata_rights_status?: string;
  };
};

type SMBRow = {
  id: string;
  object_id: number;
  title?: string | null;
  inventory_number?: string | null;
  institution?: string | null;
  object_url?: string | null;
  description?: string | null;
  dating?: string | null;
  production_place?: string | null;
  collector?: string | null;
  material?: string | null;
  technique?: string | null;
  dimensions?: string | null;
  rights?: string | null;
  image_file?: string | null;
  image_page_url?: string | null;
  raw_api_record?: SMBRawRecord;
};

interface Props {
  row: SMBRow | null;
  imageUrl: string | null;
  onClose: () => void;
}

export function SMBModal({ row, imageUrl, onClose }: Props) {
  if (!row) return null;

  const mainImage = row.raw_api_record?.object_images?.[0];
  const rightsHolder = row.raw_api_record?.licence?.metadata_rights_holder;
  const rightsStatus = row.raw_api_record?.licence?.metadata_rights_status;

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
              {row.inventory_number || row.id}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              SMB / Ethnologisches Museum record
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
                  alt={row.title || row.inventory_number || row.id}
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
                  Object Record
                </p>

                <div className="space-y-2 text-sm text-foreground">
                  <p>
                    <strong>Object ID:</strong> {row.object_id}
                  </p>

                  {row.inventory_number && (
                    <p>
                      <strong>Inventory number:</strong> {row.inventory_number}
                    </p>
                  )}

                  {row.title && (
                    <p>
                      <strong>Title:</strong> {row.title}
                    </p>
                  )}

                  {row.institution && (
                    <p>
                      <strong>Institution:</strong> {row.institution}
                    </p>
                  )}

                  {row.production_place && (
                    <p>
                      <strong>Production place:</strong> {row.production_place}
                    </p>
                  )}

                  {row.dating && (
                    <p>
                      <strong>Date:</strong> {row.dating}
                    </p>
                  )}

                  {row.collector && (
                    <p>
                      <strong>Collector:</strong> {row.collector}
                    </p>
                  )}

                  {row.material && (
                    <p>
                      <strong>Material:</strong> {row.material}
                    </p>
                  )}

                  {row.technique && (
                    <p>
                      <strong>Technique:</strong> {row.technique}
                    </p>
                  )}

                  {row.dimensions && (
                    <p>
                      <strong>Dimensions:</strong> {row.dimensions}
                    </p>
                  )}
                </div>
              </div>

              {row.description && (
                <div className="rounded-lg border border-border/30 bg-background/40 p-4">
                  <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                    Description
                  </p>
                  <p className="text-sm leading-7 text-foreground">
                    {row.description}
                  </p>
                </div>
              )}

              <div className="rounded-lg border border-border/30 bg-background/40 p-4">
                <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                  Source / Rights
                </p>

                <div className="space-y-2 text-sm text-foreground">
                  {rightsStatus || row.rights ? (
                    <p>
                      <strong>Rights:</strong> {rightsStatus || row.rights}
                    </p>
                  ) : null}

                  {rightsHolder && (
                    <p>
                      <strong>Rights holder:</strong> {rightsHolder}
                    </p>
                  )}

                  {mainImage?.owner && (
                    <p>
                      <strong>Image owner:</strong> {mainImage.owner}
                    </p>
                  )}

                  {mainImage?.creator && (
                    <p>
                      <strong>Image creator:</strong> {mainImage.creator}
                    </p>
                  )}

                  {row.object_url && (
                    <a
                      href={row.object_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block text-primary underline-offset-4 hover:underline"
                    >
                      Open museum-digital record
                    </a>
                  )}

                  {row.image_page_url && (
                    <a
                      href={row.image_page_url}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-primary underline-offset-4 hover:underline"
                    >
                      Open image record
                    </a>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-border/30 bg-background/40 p-4">
                <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                  Research note
                </p>
                <p className="text-sm leading-7 text-muted-foreground">
                  This record belongs to the SMB / Berlin institutional holdings layer.
                  Restitution status should be attached only where object-level or
                  collection-level evidence supports it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}