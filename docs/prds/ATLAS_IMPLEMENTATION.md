# Atlas research update implementation note

The canonical product specification is [docs/PRD.md](docs/PRD.md). This note records the current implementation boundary and local workflow; it does not replace the PRD.

## Existing application assessment

1. The live MVP uses Vite, React 18, TypeScript, React Router, Tailwind, and shadcn/Radix components.
2. Object records are committed as JSON and TypeScript datasets under `data/normalized` and `src/data`.
3. There is no database schema, API, or server-side persistence.
4. Existing institution-specific Python and Node scripts normalize Oxford, British Museum, Met, and SMB source data; the Atlas importer is the unified workbook workflow.
5. `/map` is a two-dimensional Pitts image-similarity visualization, not a geographic atlas.
6. There is no authenticated administration or shared editing interface.
7. Sources and citations are stored as dataset-specific fields and URLs.
8. Digital Benin links are sparse and dataset-specific; the Atlas overlay supplies normalized matching fields.
9. Vite writes the production bundle to `docs/` with the `/digital-benin-bloom/` base path for static hosting.
10. The safest migration is a separate, generated Atlas overlay that leaves curated institutional datasets unchanged.

## Local workflow

From PowerShell:

```powershell
cd "C:\Users\HP\Documents\digital_benin\digital-benin-bloom"
py -m venv .venv
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
npm.cmd install
```

Import and validate an updated workbook:

```powershell
npm.cmd run atlas:import
npm.cmd run atlas:test
```

Review `data/normalized/atlas_import_report.json` and `atlas_import_warnings.csv`. Curated field corrections can be placed in `data/curated/atlas_overrides.json`, keyed by `local_record_id`, before rerunning the importer.

Run and verify the site:

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run build
npm.cmd run dev
```

Open `http://localhost:8080/digital-benin-bloom/atlas`.

## Publication behavior

All imported records are displayed with an **Imported — needs review** badge. Uncertain fields remain uncertain. Collection rows are identified as aggregate research leads and never counted as individual objects. Raw workbook rows and internal research notes are excluded from the frontend dataset.

Persistent researcher accounts, browser editing, approval workflows, structured provenance editing, and persistent research-task management are Phase 2 work, deferred until the project adopts an authenticated backend.
