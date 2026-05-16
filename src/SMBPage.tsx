import { useMemo, useState } from 'react';
import smbData from '../data/normalized/smb_benin_objects.json';
import { SMBCard } from '@/components/SMBCard';
import { SMBModal } from '@/components/SMBModal';

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
  raw_api_record?: unknown;
};

const SMB_IMAGE_DIR = 'benin_output/smb';

export default function SMBPage() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<SMBRow | null>(null);

  const rows = smbData as SMBRow[];

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();

    return rows
      .filter((row) => {
        if (!q) return true;

        const haystack = [
          row.id,
          row.object_id,
          row.title,
          row.inventory_number,
          row.institution,
          row.description,
          row.dating,
          row.production_place,
          row.collector,
          row.material,
          row.technique,
          row.dimensions,
          row.rights,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return haystack.includes(q);
      })
      .sort((a, b) => {
        const aKey = a.inventory_number || a.title || a.id;
        const bKey = b.inventory_number || b.title || b.id;

        return aKey.localeCompare(bKey, undefined, {
          numeric: true,
          sensitivity: 'base',
        });
      });
  }, [rows, query]);

  function imageUrl(row: SMBRow) {
    if (!row.image_file) return null;
    return `${import.meta.env.BASE_URL}${SMB_IMAGE_DIR}/${row.image_file}`;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-12">
        <div className="text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-muted-foreground">
            SMB Berlin
          </p>

          <h1 className="text-4xl font-semibold text-gold md:text-5xl">
            SMB / Ethnologisches Museum Holdings
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
            Structured records from Staatliche Museen zu Berlin / museum-digital,
            forming a Berlin institutional holdings layer for Benin-related objects.
            These records are treated as working data pending manual review.
          </p>

          <div className="mt-3 text-sm text-muted-foreground">
            Showing {filteredRows.length} of {rows.length} records
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-border/40 bg-card/40 p-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, inventory number, place, collector, material..."
            className="w-full rounded-md border border-border/50 bg-background px-4 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/40"
          />
        </div>

        <div className="mt-6 rounded-xl border border-border/40 bg-card/30 p-5 text-sm leading-7 text-muted-foreground">
          <p>
            The SMB layer is generated from museum-digital structured records. Many source fields are in German because the records come from Staatliche Museen zu Berlin / Ethnologisches Museum. Records are being manually reviewed to distinguish Kingdom of Benin / Edo court material from broader Nigerian, West African, or modern Republic of Benin references. 
            Until reviewed, these records should not be treated as confirmed Benin court objects.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredRows.map((row) => (
            <SMBCard
              key={row.id}
              row={row}
              imageUrl={imageUrl(row)}
              onClick={() => setSelected(row)}
            />
          ))}
        </div>
      </div>

      <SMBModal
        row={selected}
        imageUrl={selected ? imageUrl(selected) : null}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}