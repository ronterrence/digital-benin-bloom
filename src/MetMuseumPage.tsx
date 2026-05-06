import { useMemo, useState } from 'react';
import metData from '../data/normalized/metmuseum_benin_objects.json';
import { MetMuseumCard } from '@/components/MetMuseumCard';
import { MetMuseumModal } from '@/components/MetMuseumModal';

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

const MET_IMAGE_DIR = 'benin_output/metmuseum';

export default function MetMuseumPage() {
  const [query, setQuery] = useState('');
  const [showPublicDomainOnly, setShowPublicDomainOnly] = useState(false);
  const [selected, setSelected] = useState<MetRow | null>(null);

  const rows = metData as MetRow[];

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();

    return rows
      .filter((row) => {
        if (showPublicDomainOnly && !row.is_public_domain) return false;

        if (!q) return true;

        const haystack = [
          row.id,
          row.object_id,
          row.accession_number,
          row.title,
          row.object_name,
          row.department,
          row.culture,
          row.period,
          row.object_date,
          row.medium,
          row.country,
          row.region,
          row.classification,
          row.credit_line,
          row.repository,
          row.gallery_number,
          row.tags,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return haystack.includes(q);
      })
      .sort((a, b) => {
        const aAcc = a.accession_number || a.id || '';
        const bAcc = b.accession_number || b.id || '';

        return aAcc.localeCompare(bAcc, undefined, {
          numeric: true,
          sensitivity: 'base',
        });
      });
  }, [rows, query, showPublicDomainOnly]);

  const publicDomainCount = useMemo(() => {
    return rows.filter((row) => row.is_public_domain).length;
  }, [rows]);

  function imageUrl(row: MetRow) {
    if (!row.image_file) return null;
    return `${import.meta.env.BASE_URL}${MET_IMAGE_DIR}/${row.image_file}`;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-12">
        <div className="text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-muted-foreground">
            Met Museum
          </p>

          <h1 className="text-4xl font-semibold text-gold md:text-5xl">
            Metropolitan Museum Holdings
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
            Selected Metropolitan Museum of Art records related to Benin, Edo,
            Nigeria, and associated dispersal histories. This section is a
            searchable institutional holdings layer and should be treated as a
            working dataset pending manual review.
          </p>

          <div className="mt-3 text-sm text-muted-foreground">
            <span>{rows.length} records</span>
            <span className="mx-2">·</span>
            <span>{publicDomainCount} public domain records</span>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-border/40 bg-card/40 p-4 md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search accession, title, culture, medium, region, tags..."
              className="w-full rounded-md border border-border/50 bg-background px-4 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/40"
            />

            <button
              type="button"
              onClick={() => setShowPublicDomainOnly((prev) => !prev)}
              className={`inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition ${
                showPublicDomainOnly
                  ? 'border-primary/40 text-primary hover:bg-primary/10'
                  : 'border-border/50 text-foreground hover:bg-muted'
              }`}
            >
              {showPublicDomainOnly ? 'Show all records' : 'Public domain only'}
            </button>
          </div>

          <div className="mt-3 text-sm text-muted-foreground">
            Showing {filteredRows.length} of {rows.length} records
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-border/40 bg-card/30 p-5 text-sm leading-7 text-muted-foreground">
          <p>
            The Met Museum section is currently generated from search results and
            should be manually reviewed. Some records may be broader Nigeria,
            Edo, or West African objects rather than confirmed Benin court objects.
            Public-domain records are especially useful for exhibition display and
            future cross-referencing.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredRows.map((row) => (
            <MetMuseumCard
              key={row.id}
              row={row}
              imageUrl={imageUrl(row)}
              onClick={() => setSelected(row)}
            />
          ))}
        </div>
      </div>

      <MetMuseumModal
        row={selected}
        imageUrl={selected ? imageUrl(selected) : null}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}