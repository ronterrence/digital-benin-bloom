import { useEffect, useMemo, useState } from "react";
import { divIcon, latLngBounds } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import atlasJson from "../data/normalized/atlas_public_records.json";
import type { AtlasRecord } from "@/data/atlasTypes";
import { label, recordsToCsv, summarizeInstitutions } from "@/lib/atlas";

const records = atlasJson as AtlasRecord[];

type Filters = {
  query: string; country: string; city: string; institution: string; recordLevel: string;
  objectType: string; confidence: string; expedition: string; digitalBenin: string;
  restitution: string; ownership: string; physical: string;
};

const emptyFilters: Filters = { query: "", country: "", city: "", institution: "", recordLevel: "", objectType: "", confidence: "", expedition: "", digitalBenin: "", restitution: "", ownership: "", physical: "" };

function FilterSelect({ labelText, value, values, onChange }: { labelText: string; value: string; values: string[]; onChange: (value: string) => void }) {
  return <label className="text-xs text-muted-foreground"><span className="mb-1 block">{labelText}</span><select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm text-foreground"><option value="">All</option>{values.map((item) => <option key={item} value={item}>{label(item)}</option>)}</select></label>;
}

function Badge({ value, warning = false }: { value: string; warning?: boolean }) {
  return <span className={`inline-flex rounded-full border px-2 py-1 text-[11px] ${warning ? "border-amber-500/50 bg-amber-500/10 text-amber-200" : "border-primary/35 bg-primary/10 text-primary"}`}>{label(value)}</span>;
}

function FitMap({ summaries }: { summaries: ReturnType<typeof summarizeInstitutions> }) {
  const map = useMap();
  useEffect(() => {
    if (!summaries.length) return;
    const bounds = latLngBounds(summaries.map((item) => [item.latitude, item.longitude]));
    map.fitBounds(bounds, { padding: [30, 30], maxZoom: 6 });
  }, [map, summaries]);
  return null;
}

function download(name: string, content: string, type: string) {
  const href = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a"); anchor.href = href; anchor.download = name; anchor.click(); URL.revokeObjectURL(href);
}

function RecordDetail({ record, onClose }: { record: AtlasRecord; onClose: () => void }) {
  return <div className="fixed inset-0 z-[1000] flex items-end justify-center bg-black/75 p-0 md:items-center md:p-6" role="dialog" aria-modal="true" aria-labelledby="atlas-detail-title" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <article className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-xl border border-border bg-card p-6 shadow-2xl md:rounded-xl">
      <div className="flex items-start justify-between gap-4"><div><Badge value={record.review_state} warning /><h2 id="atlas-detail-title" className="mt-3 text-2xl text-gold">{record.object_title}</h2><p className="mt-1 text-sm text-muted-foreground">{record.institution_name} · {record.city}, {record.country}</p></div><button type="button" onClick={onClose} className="rounded border border-border px-3 py-1 text-sm" aria-label="Close details">Close</button></div>
      <div className="mt-5 flex flex-wrap gap-2"><Badge value={record.record_level} /><Badge value={record.confidence_level} warning={record.confidence_level !== "confirmed"} /><Badge value={record.expedition_1897_status} warning={!record.expedition_1897_status.startsWith("confirmed")} /><Badge value={record.digital_benin_match_status} warning={!record.digital_benin_match_status.startsWith("matched")} /><Badge value={record.current_ownership_status} warning={record.current_ownership_status === "status_unclear"} /></div>
      <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        {[['Record identifier', record.accession_number || record.collection_identifier], ['Object type', record.object_type], ['Attribution', record.cultural_attribution_original], ['Date / period', record.date_period], ['Material', record.material], ['Acquisition', record.acquisition_date], ['Legal ownership', label(record.current_ownership_status)], ['Physical location', record.current_physical_location || label(record.current_physical_location_status)], ['Restitution', label(record.restitution_status)]].map(([term, value]) => <div key={term}><dt className="text-xs uppercase tracking-wide text-muted-foreground">{term}</dt><dd className="mt-1">{value || "Not documented"}</dd></div>)}
      </dl>
      <section className="mt-6"><h3 className="text-lg">Provenance</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{record.provenance_summary || "Not documented"}</p><p className="mt-2 text-xs text-muted-foreground">1897 assessment: {record.expedition_1897_source_text || "Unresolved"}</p></section>
      <section className="mt-6"><h3 className="text-lg">Research warnings</h3><ul className="mt-2 space-y-2">{record.warnings.map((warning) => <li key={`${warning.code}-${warning.field}`} className="rounded-md border border-amber-500/25 bg-amber-500/5 p-3 text-sm text-amber-100">{warning.message}</li>)}</ul></section>
      <div className="mt-6 flex flex-wrap gap-3">{record.museum_catalogue_url && <a href={record.museum_catalogue_url} target="_blank" rel="noreferrer" className="text-sm text-primary underline">Museum catalogue</a>}{record.digital_benin_url && <a href={record.digital_benin_url} target="_blank" rel="noreferrer" className="text-sm text-primary underline">Digital Benin</a>}</div>
    </article>
  </div>;
}

export default function AtlasPage() {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [selected, setSelected] = useState<AtlasRecord | null>(null);
  const options = (key: keyof AtlasRecord) => [...new Set(records.map((record) => String(record[key] ?? "")).filter(Boolean))].sort();
  const filtered = useMemo(() => records.filter((record) => {
    const q = filters.query.trim().toLowerCase();
    const haystack = [record.object_title, record.institution_name, record.city, record.country, record.accession_number, record.collection_identifier, record.provenance_summary].join(" ").toLowerCase();
    return (!q || haystack.includes(q)) && (!filters.country || record.country === filters.country) && (!filters.city || record.city === filters.city) && (!filters.institution || record.institution_name === filters.institution) && (!filters.recordLevel || record.record_level === filters.recordLevel) && (!filters.objectType || record.object_type_normalized === filters.objectType) && (!filters.confidence || record.confidence_level === filters.confidence) && (!filters.expedition || record.expedition_1897_status === filters.expedition) && (!filters.digitalBenin || record.digital_benin_match_status === filters.digitalBenin) && (!filters.restitution || record.restitution_status === filters.restitution) && (!filters.ownership || record.current_ownership_status === filters.ownership) && (!filters.physical || record.current_physical_location_status === filters.physical);
  }), [filters]);
  const summaries = useMemo(() => summarizeInstitutions(filtered), [filtered]);
  const setFilter = (key: keyof Filters, value: string) => setFilters((current) => ({ ...current, [key]: value }));
  const markerIcon = (count: number) => divIcon({ className: "", html: `<span class="atlas-marker">${count}</span>`, iconSize: [34, 34], iconAnchor: [17, 17] });

  return <main className="min-h-screen bg-background">
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-16 md:px-6">
      <header className="text-center"><p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Research atlas</p><h1 className="mt-3 text-4xl text-gold md:text-5xl">Benin Artefacts Atlas</h1><p className="mx-auto mt-4 max-w-3xl leading-7 text-muted-foreground">A location-based view of 45 object and collection records. This is evolving research: uncertainty and incomplete evidence are shown rather than silently resolved.</p></header>
      <section className="mt-8 rounded-xl border border-border/50 bg-card/40 p-4" aria-label="Atlas filters">
        <div className="flex flex-col gap-3 md:flex-row"><input value={filters.query} onChange={(e) => setFilter("query", e.target.value)} placeholder="Search objects, institutions, accessions, provenance…" className="w-full rounded-md border border-border/60 bg-background px-4 py-2 text-sm"/><button type="button" onClick={() => setFilters(emptyFilters)} className="rounded-md border border-border px-4 py-2 text-sm">Clear filters</button></div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <FilterSelect labelText="Country" value={filters.country} values={options("country")} onChange={(v) => setFilter("country", v)} /><FilterSelect labelText="City" value={filters.city} values={options("city")} onChange={(v) => setFilter("city", v)} /><FilterSelect labelText="Institution" value={filters.institution} values={options("institution_name")} onChange={(v) => setFilter("institution", v)} /><FilterSelect labelText="Record level" value={filters.recordLevel} values={options("record_level")} onChange={(v) => setFilter("recordLevel", v)} />
          <FilterSelect labelText="Object type" value={filters.objectType} values={options("object_type_normalized")} onChange={(v) => setFilter("objectType", v)} /><FilterSelect labelText="Confidence" value={filters.confidence} values={options("confidence_level")} onChange={(v) => setFilter("confidence", v)} /><FilterSelect labelText="1897 status" value={filters.expedition} values={options("expedition_1897_status")} onChange={(v) => setFilter("expedition", v)} /><FilterSelect labelText="Digital Benin" value={filters.digitalBenin} values={options("digital_benin_match_status")} onChange={(v) => setFilter("digitalBenin", v)} />
          <FilterSelect labelText="Restitution" value={filters.restitution} values={options("restitution_status")} onChange={(v) => setFilter("restitution", v)} /><FilterSelect labelText="Ownership" value={filters.ownership} values={options("current_ownership_status")} onChange={(v) => setFilter("ownership", v)} /><FilterSelect labelText="Physical location" value={filters.physical} values={options("current_physical_location_status")} onChange={(v) => setFilter("physical", v)} />
        </div>
      </section>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground"><p>Showing <span className="text-foreground">{filtered.length}</span> records across <span className="text-foreground">{summaries.length}</span> mapped institutions</p><div className="flex gap-2"><button type="button" className="rounded border border-border px-3 py-2" onClick={() => download("benin-atlas-filtered.json", JSON.stringify(filtered, null, 2), "application/json")}>Export JSON</button><button type="button" className="rounded border border-border px-3 py-2" onClick={() => download("benin-atlas-filtered.csv", recordsToCsv(filtered), "text/csv;charset=utf-8")}>Export CSV</button></div></div>
      <section className="mt-5 overflow-hidden rounded-xl border border-border/50" aria-label="Geographic map"><MapContainer center={[45, -20]} zoom={3} scrollWheelZoom className="h-[62vh] min-h-[480px] w-full"><TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/><FitMap summaries={summaries}/>{summaries.map((summary) => <Marker key={summary.institutionId} position={[summary.latitude, summary.longitude]} icon={markerIcon(summary.records.length)}><Popup><div className="min-w-56 text-slate-900"><strong>{summary.institutionName}</strong><div>{summary.city}, {summary.country}</div><hr className="my-2"/><div>{summary.objectCount} objects · {summary.collectionCount} collections</div><div>{summary.confirmedCount} confirmed · {summary.unresolvedCount} unresolved</div><div>{summary.confirmed1897Count} confirmed 1897-linked</div><div>{summary.digitalBeninMatchedCount} Digital Benin matches</div><div>{summary.ownershipTransferredCount} ownership/return actions</div><div>{summary.physicallyReturnedCount} physically returned · {summary.stillPresentCount} still present/loaned</div><div>{summary.warningCount} open warnings</div></div></Popup></Marker>)}</MapContainer></section>
      <section className="mt-10" aria-labelledby="atlas-directory"><h2 id="atlas-directory" className="text-2xl text-gold">Institution directory</h2><div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((record) => <article key={record.local_record_id} className="flex flex-col rounded-xl border border-border/50 bg-card/40 p-5"><div className="flex flex-wrap gap-2"><Badge value={record.record_level}/><Badge value={record.confidence_level} warning={record.confidence_level !== "confirmed"}/>{record.warnings.length > 0 && <Badge value={`${record.warnings.length} warnings`} warning/>}</div><h3 className="mt-4 text-xl">{record.object_title}</h3><p className="mt-2 text-sm text-muted-foreground">{record.institution_name}<br/>{record.city}, {record.country}</p><p className="mt-3 text-sm">{record.accession_number || record.collection_identifier}</p><div className="mt-4 flex flex-wrap gap-2"><Badge value={record.expedition_1897_status} warning={!record.expedition_1897_status.startsWith("confirmed")}/><Badge value={record.digital_benin_match_status} warning={!record.digital_benin_match_status.startsWith("matched")}/></div><button type="button" onClick={() => setSelected(record)} className="mt-5 rounded-md border border-primary/40 px-4 py-2 text-sm text-primary">View research record</button></article>)}</div>{filtered.length === 0 && <p className="mt-6 rounded border border-border p-6 text-muted-foreground">No records match these filters.</p>}</section>
    </div>{selected && <RecordDetail record={selected} onClose={() => setSelected(null)}/>}</main>;
}
