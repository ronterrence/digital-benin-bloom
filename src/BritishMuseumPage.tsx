import { useMemo, useState } from 'react';
import bmData from '../data/normalized/britishmuseum_benin_objects.json';
import { BritishMuseumCard } from '@/components/BritishMuseumCard';
import { BritishMuseumModal } from '@/components/BritishMuseumModal';

type BMRow = {
  id: string;
  reg_number?: string | null;
  museum_number?: string | null;
  title?: string | null;
  object_type?: string | null;
  date?: string | null;
  culture?: string | null;
  ethnic_name?: string | null;
  production_place?: string | null;
  find_spot?: string | null;
  materials?: string | null;
  technique?: string | null;
  dimensions?: string | null;
  description?: string | null;
  curators_comments?: string | null;
  subjects?: string | null;
  location?: string | null;
  acquisition_date?: string | null;
  acquisition_notes?: string | null;
  expedition_note?: string | null;
  image_url?: string | null;
  image_file?: string | null;
  museum_url?: string | null;
};

const BM_IMAGE_DIR = 'benin_output/britishmuseum';

export default function BritishMuseumPage() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<BMRow | null>(null);

  const rows = bmData as BMRow[];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return rows.filter((row) => {
      if (!q) return true;

      return [
        row.id,
        row.title,
        row.description,
        row.materials,
        row.production_place,
        row.date,
        row.acquisition_date,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [rows, query]);

function imageUrl(row: BMRow) {
  if (!row.image_file) return null;
  return `${import.meta.env.BASE_URL}benin_output/britishmuseum/${row.image_file}`;
}

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-12">
        <div className="text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-muted-foreground">
            British Museum
          </p>

          <h1 className="text-4xl font-semibold text-gold md:text-5xl">
            Benin Artifacts in British Museum Collections
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
            Institutional records from the British Museum collection, providing
            object-level documentation, acquisition data, and provenance.
          </p>

          <div className="mt-3 text-sm text-muted-foreground">
            Showing {filtered.length} of {rows.length} records
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-border/40 bg-card/40 p-4">
          <input
            type="text"
            placeholder="Search object number, title, description, material, provenance..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-md border border-border/50 bg-background px-4 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/40"
          />
        </div>

        <div className="mt-6 rounded-xl border border-border/40 bg-card/30 p-5 text-sm leading-7 text-muted-foreground">
          <p>
            The British Museum and the Ethnologisches Museum, Berlin, hold two of the largest
            collections of Benin objects in Europe. Other significant collections are held by
            institutions in Vienna, Cambridge, Köln, Dresden, Hamburg, Leipzig, Stuttgart,
            the Netherlands, Oxford, Scotland, Stockholm, and major museums in the United States,
            including Chicago, Boston, New York, Washington, and Philadelphia.
          </p>

          <p className="mt-3">
            Some objects have now been legally transferred to Nigerian ownership, although many
            remain physically located in European and North American institutions.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((row) => (
            <BritishMuseumCard
              key={row.id}
              row={row}
              imageUrl={imageUrl(row)}
              onClick={() => setSelected(row)}
            />
          ))}
        </div>
      </div>

      <BritishMuseumModal
        row={selected}
        imageUrl={selected ? imageUrl(selected) : null}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}