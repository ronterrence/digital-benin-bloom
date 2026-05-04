import { useMemo, useState } from 'react';
import oxfordHoldingsWithImages from '../data/normalized/subsets/oxford_holdings_with_images.json';
import { OxfordCard } from '@/components/OxfordCard';
import { OxfordModal } from '@/components/OxfordModal';

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
  has_description?: boolean;
  has_image?: boolean;
  matched?: boolean;
};

const OXFORD_IMAGE_DIR = 'benin_output/atlas/oxford';

export default function OxfordPage() {
  const [query, setQuery] = useState('');
  const [showConfirmedOnly, setShowConfirmedOnly] = useState(false);
  const [selected, setSelected] = useState<OxfordHoldingRow | null>(null);

  const rows = oxfordHoldingsWithImages as OxfordHoldingRow[];

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();

    return rows
      .filter((row) => {
        if (showConfirmedOnly && row.status !== 'confirmed_1897') return false;

        if (!q) return true;

        const haystack = [
          row.accession_number,
          row.title,
          row.description,
          row.section,
          row.provenance,
          row.provenance_detail,
          row.publication_notes,
          row.status,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return haystack.includes(q);
      })
      .sort((a, b) => {
        const aAcc = a.accession_number || '';
        const bAcc = b.accession_number || '';
        return aAcc.localeCompare(bAcc, undefined, {
          numeric: true,
          sensitivity: 'base',
        });
      });
  }, [rows, query, showConfirmedOnly]);

  const confirmedCount = useMemo(
    () => rows.filter((row) => row.status === 'confirmed_1897').length,
    [rows]
  );

  function imageUrl(row: OxfordHoldingRow) {
    if (!row.primary_image_file) return null;
    return `${import.meta.env.BASE_URL}${OXFORD_IMAGE_DIR}/${row.primary_image_file}`;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-12">
        <div className="text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-muted-foreground">
            Oxford
          </p>

          <h1 className="text-4xl font-semibold text-gold md:text-5xl">
            Oxford Holdings
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
            Museum-side records extracted from the Pitt Rivers / Dan Hicks material,
            browsable as a separate holdings universe from the Mike Pitts archive.
          </p>

          <div className="mt-3 text-sm text-muted-foreground">
            <span>{rows.length} image-backed records</span>
            <span className="mx-2">·</span>
            <span>{confirmedCount} marked confirmed_1897</span>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-border/40 bg-card/40 p-4 md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search accession, title, description, provenance..."
              className="w-full rounded-md border border-border/50 bg-background px-4 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/40"
            />

            <button
              type="button"
              onClick={() => setShowConfirmedOnly((prev) => !prev)}
              className={`inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition ${
                showConfirmedOnly
                  ? 'border-primary/40 text-primary hover:bg-primary/10'
                  : 'border-border/50 text-foreground hover:bg-muted'
              }`}
            >
              {showConfirmedOnly ? 'Show all records' : 'Confirmed 1897 only'}
            </button>
          </div>

          <div className="mt-3 text-sm text-muted-foreground">
            Showing {filteredRows.length} of {rows.length} records
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredRows.map((row) => (
            <OxfordCard
              key={row.accession_number}
              row={row}
              imageUrl={imageUrl(row)}
              onClick={() => setSelected(row)}
            />
          ))}
        </div>
      </div>

      <OxfordModal
        row={selected}
        imageUrl={selected ? imageUrl(selected) : null}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}