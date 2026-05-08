import { restitutionRecords } from '@/data/restitutionRecords';

export default function RestitutionPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 pt-24 pb-12">
        <div className="text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-muted-foreground">
            Restitution
          </p>

          <h1 className="text-4xl font-semibold text-gold md:text-5xl">
            Dispersal & Restitution Records
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
            A developing layer for tracking institutional movement, current location,
            ownership-transfer status, restitution actions, and return agreements
            connected to Benin objects.
          </p>

          <p className="mt-3 text-sm text-muted-foreground">
            {restitutionRecords.length} record{restitutionRecords.length === 1 ? '' : 's'}
          </p>
        </div>

        <div className="mt-10 space-y-6">
          {restitutionRecords.map((record) => (
            <article
              key={record.id}
              className="rounded-xl border border-border/40 bg-card/40 p-6"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                    {record.institutionShortName}
                    {record.transferInstitutionShortName
                      ? ` → ${record.transferInstitutionShortName}`
                      : ''}
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold text-primary">
                    {record.title}
                  </h2>

                  {record.englishTitle && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {record.englishTitle}
                    </p>
                  )}
                </div>

                {record.restitutionStatus && (
                  <span className="rounded-full border border-primary/30 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary">
                    {record.restitutionStatus}
                  </span>
                )}
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-lg border border-border/30 bg-background/40 p-4">
                  <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                    Object Record
                  </p>

                  <div className="space-y-2 text-sm text-foreground">
                    <p>
                      <strong>Inventory number:</strong> {record.inventoryNumber}
                    </p>

                    <p>
                      <strong>Institution:</strong> {record.institution}
                    </p>

                    {record.transferInstitution && (
                      <p>
                        <strong>Transfer institution:</strong> {record.transferInstitution}
                      </p>
                    )}

                    <p>
                      <strong>Location:</strong> {record.city}, {record.country}
                    </p>

                    {record.objectType && (
                      <p>
                        <strong>Object type:</strong> {record.objectType}
                      </p>
                    )}

                    {record.productionDate && (
                      <p>
                        <strong>Date:</strong> {record.productionDate}
                      </p>
                    )}

                    {record.productionPlace && (
                      <p>
                        <strong>Production place:</strong> {record.productionPlace}
                      </p>
                    )}

                    {record.material && (
                      <p>
                        <strong>Material:</strong> {record.material}
                      </p>
                    )}

                    {record.technique && (
                      <p>
                        <strong>Technique:</strong> {record.technique}
                      </p>
                    )}

                    {record.dimensions && (
                      <p>
                        <strong>Dimensions:</strong> {record.dimensions}
                      </p>
                    )}

                    {record.rights && (
                      <p>
                        <strong>Rights:</strong> {record.rights}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-5">
                  {record.description && (
                    <div className="rounded-lg border border-border/30 bg-background/40 p-4">
                      <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                        Description
                      </p>
                      <p className="text-sm leading-7 text-foreground">
                        {record.description}
                      </p>
                    </div>
                  )}

                  <div className="rounded-lg border border-border/30 bg-background/40 p-4">
                    <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                      Restitution / Status
                    </p>

                    <div className="space-y-2 text-sm text-foreground">
                      {record.provenanceResearchStatus && (
                        <p>
                          <strong>Provenance research:</strong>{' '}
                          {record.provenanceResearchStatus}
                        </p>
                      )}

                      {record.restitutionStatus && (
                        <p>
                          <strong>Restitution status:</strong>{' '}
                          {record.restitutionStatus}
                        </p>
                      )}

                      {record.physicalStatus && (
                        <p>
                          <strong>Physical / institutional status:</strong>{' '}
                          {record.physicalStatus}
                        </p>
                      )}
                    </div>
                  </div>

                  {record.restitutionTimeline && (
                    <div className="rounded-lg border border-border/30 bg-background/40 p-4">
                      <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                        Timeline
                      </p>

                      <div className="space-y-3">
                        {record.restitutionTimeline.map((item, index) => (
                          <div
                            key={`${record.id}-${index}`}
                            className="border-l border-primary/30 pl-4"
                          >
                            <p className="text-sm font-medium text-primary">
                              {item.date || item.year}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                              {item.event}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="rounded-lg border border-border/30 bg-background/40 p-4">
                    <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                      Source
                    </p>

                    <a
                      href={record.objectUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-primary underline-offset-4 hover:underline"
                    >
                      Open source record
                    </a>

                    {record.citation && (
                      <p className="mt-3 text-xs leading-6 text-muted-foreground">
                        {record.citation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}