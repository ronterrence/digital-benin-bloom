# PRD: Digital Benin Bloom — Atlas Research Update & Data Integration

## 1. Context

Digital Benin Bloom is already live. The current task is not to build a new MVP from scratch. The goal is to update the live MVP with a new research layer based on recent atlas work and the expanded Benin artefacts register covering institutions in Europe and the United States.

The update should improve the existing product by adding cleaner object data, institution coverage, Digital Benin cross-references, restitution status, provenance trails, and an atlas-ready structure for mapping artefacts by city, institution, ownership status, and research confidence.

This PRD is intended for Codex or an engineering agent working inside the existing repository.

---

## 2. Product objective

Update the live Digital Benin Bloom MVP so that it can support a richer **Benin Artefacts Atlas**.

The updated system should allow users to:

1. browse Benin Kingdom / Edo artefact records by location;
2. distinguish confirmed artefacts from probable or unresolved leads;
3. see which objects have Digital Benin matches;
4. see which objects have unresolved Digital Benin matching work;
5. see current restitution, ownership, and physical-location status;
6. trace provenance through collectors, dealers, auctions, museums, and restitution events;
7. maintain a research queue for unresolved atlas records;
8. import revised spreadsheet data without overwriting manually curated live data.

---

## 3. Existing product assumption

Assume the live MVP already has some or all of the following:

- object records;
- institution/location pages;
- map or atlas interface;
- basic search or filtering;
- admin/editing workflow;
- deployed frontend;
- existing database or structured data store.

Codex must first inspect the existing repository and adapt to the current architecture rather than replacing it.

---

## 4. Engineering instruction for Codex

Before making changes, Codex should inspect the existing app and answer these questions in comments or a short implementation note:

```txt id="rpkxms"
1. What framework is the live MVP using?
2. Where are object records stored?
3. Is there an existing database schema?
4. Is there an existing import pipeline?
5. Is there an existing map/atlas component?
6. Is there an admin interface?
7. How are sources/citations stored?
8. How are Digital Benin links currently represented?
9. How is deployment configured?
10. What is the safest migration path?
```

Do not rebuild the app from scratch unless the existing codebase is empty or unusable.

---

## 5. Update scope

### In scope

1. Add or update atlas data fields.
2. Add import/update workflow for revised artefact register.
3. Add Digital Benin matching status.
4. Add restitution and ownership status fields.
5. Add provenance entities and events if not already present.
6. Add research task tracking.
7. Add filters and badges for uncertainty.
8. Add or improve map/atlas views.
9. Add export support for atlas data.
10. Add validation warnings for incomplete records.

### Out of scope

1. Rebuilding the live MVP from scratch.
2. Scraping Digital Benin automatically in this update.
3. Publishing unverified claims as confirmed.
4. Removing existing manually curated live content.
5. Assuming all Benin/Edo artefacts are 1897-looted.
6. Conflating legal ownership with physical location.
7. Changing the public narrative without editorial review.

---

## 6. New atlas data fields

Each object record should support these fields, either directly or through related tables.

```ts id="qwku7c"
type AtlasObjectFields = {
  local_record_id?: string;

  country?: string;
  city?: string;
  institution_name?: string;
  institution_id?: string;

  object_title?: string;
  original_language_title?: string;
  object_type?: string;
  object_type_normalized?: string;

  cultural_attribution_original?: string;
  cultural_attribution_normalized?: string;
  modern_geographic_reference?: string;

  date_period?: string;
  material?: string;
  dimensions?: string;
  maker_artist?: string;

  accession_number?: string;
  inventory_number?: string;
  department_collection?: string;

  acquisition_date?: string;
  acquisition_method?: string;

  provenance_summary?: string;
  provenance_confidence?: "confirmed" | "probable" | "unclear" | "exclude";

  expedition_1897_status?:
    | "confirmed_1897_looted"
    | "probable_1897_looted"
    | "possible_1897_link"
    | "benin_object_1897_unproven"
    | "not_1897_related"
    | "unclear";

  current_ownership_status?:
    | "still_owned_by_holding_museum"
    | "ownership_transferred_to_nigeria"
    | "physically_returned_to_nigeria"
    | "returned_but_on_loan_back"
    | "under_restitution_review"
    | "status_unclear";

  current_physical_location?: string;

  restitution_status?:
    | "not_started"
    | "under_review"
    | "claim_received"
    | "approved_for_return"
    | "ownership_transferred"
    | "physically_returned"
    | "loaned_back"
    | "not_applicable"
    | "unclear";

  digital_benin_id?: string;
  digital_benin_url?: string;

  digital_benin_match_status?:
    | "matched_exact"
    | "matched_probable"
    | "not_found"
    | "not_checked"
    | "not_in_scope";

  museum_catalogue_url?: string;

  image_available?: boolean;
  image_url?: string;
  image_rights?: string;
  image_credit?: string;

  source_urls?: string[];
  source_notes?: string;

  public_notes?: string;
  internal_research_notes?: string;

  last_verified_date?: string;
};
```

---

## 7. Data migration requirements

Codex should add these fields using the safest available migration method for the existing stack.

### Migration rules

1. Preserve all existing records.
2. Do not overwrite manually edited fields unless the import explicitly marks the incoming value as newer or authoritative.
3. Add `last_verified_date` where available.
4. Add `source_notes` and `source_urls`.
5. Add `raw_import_payload` or equivalent for auditability.
6. Create validation warnings rather than guessing missing values.
7. Create research tasks for missing Digital Benin IDs, missing accession numbers, unclear 1897 status, unclear restitution status, and missing image rights.

---

## 8. Import/update workflow

The system should import a revised workbook or CSV package.

Expected input options:

```txt id="t81cw7"
benin_artefacts_master_register.xlsx
objects.csv
institutions.csv
provenance_entities.csv
provenance_events.csv
research_tasks.csv
```

### Import behavior

For each imported object:

1. Try to match existing object by stable ID.
2. If no stable ID exists, match by institution + accession/inventory number.
3. If still unmatched, match by institution + object title + object type.
4. If still unmatched, create a new object as `imported_unreviewed`.
5. Preserve previous live values.
6. Add incoming values only where target fields are blank or marked stale.
7. Log all changes in an import report.
8. Generate research tasks for missing critical fields.

### Matching priority

```txt id="u10er2"
1. digital_benin_id
2. digital_benin_url
3. accession_number + institution
4. inventory_number + institution
5. museum_catalogue_url
6. normalized title + institution + object type
```

### Import report should show

```txt id="yki1rj"
records_created
records_updated
records_skipped
possible_duplicates
fields_changed
warnings_created
research_tasks_created
errors
```

---

## 9. Atlas view updates

Update the map/atlas interface to support richer location-based exploration.

Each institution marker should display:

```txt id="7akbkp"
institution name
city
country
confirmed object count
confirmed 1897-linked count
probable/unclear count
Digital Benin matched count
restituted / ownership transferred count
physically returned count
objects still physically present
research tasks open
```

Marker filters:

```txt id="8iszue"
country
city
institution
object type
1897 status
Digital Benin match status
restitution status
current ownership status
physical location status
confidence level
```

Object cards on the atlas should show:

```txt id="3z6qii"
object title
image thumbnail if available
institution
accession number
object type
1897 status badge
Digital Benin match badge
restitution badge
ownership badge
museum catalogue link
Digital Benin link
```

---

## 10. Digital Benin matching workflow

Add a workflow for managing Digital Benin matches.

### Required statuses

```txt id="15ujf4"
not_checked
matched_exact
matched_probable
not_found
not_in_scope
```

### Object detail page should support

```txt id="t36jqw"
Add Digital Benin URL
Add Digital Benin ID
Mark exact match
Mark probable match
Mark not found
Mark not in scope
Add match notes
Record last checked date
```

### Validation warnings

Show warnings when:

```txt id="ym27ui"
Digital Benin status is matched_exact but URL is missing.
Digital Benin status is matched_probable but notes are missing.
Digital Benin status is not_checked for a confirmed Benin object.
Digital Benin status is not_found but last_checked_date is missing.
Digital Benin URL exists but institution/accession number differs from local record.
```

---

## 11. Restitution and ownership workflow

The app must distinguish:

1. legal ownership;
2. current physical location;
3. display/exhibition status;
4. restitution process status;
5. loan-back status.

### Required badges

```txt id="bwdcbn"
Still held
Ownership transferred
Physically returned
Loaned back
Under review
Status unclear
```

### Object detail page should show

```txt id="phajh7"
Current legal owner
Current physical location
Former holding institution
Restitution decision date
Return date
Loan-back terms if known
Source for status
Status last verified date
```

---

## 12. Provenance workflow

If the live app does not already support structured provenance, add a minimal version.

### Provenance entity types

```txt id="zk2b2v"
person
dealer
auction_house
museum
company
collector
donor
colonial_official
government_body
unknown
```

### Provenance event types

```txt id="wni46a"
created
royal_palace_context
looted
auctioned
sold
purchased
donated
bequeathed
transferred
returned
loaned
exhibited
catalogued
unclear
```

### Priority provenance entities to seed

```txt id="2r958e"
W. D. Webster
J. C. Stevens
William Cutter
Pitt-Rivers Museum, Farnham
Crown Agent of the Niger Coast Protectorate
Robert Owen Lehman
Felix von Luschan
H. Bey & Co.
Adolph Heemke
Karl Knorr
Arthur Baessler
Theodor Rautenstrauch
John Lembcke
G. A. Frank
Justus Brinckmann
Åke Sjögren
Hjalmar Stolpe
E. E. Ayer
Klaus and Dolly Perls
Nelson Rockefeller
```

Object detail pages should show a provenance timeline, even if some events are uncertain.

Uncertain events must be visually marked as `probable` or `unclear`.

---

## 13. Research task workflow

Add or update a research queue.

### Auto-create tasks for

```txt id="4p1cjp"
Missing Digital Benin ID
Missing museum catalogue URL
Missing accession number
Unclear 1897 status
Unclear current ownership status
Unclear physical location
Missing image rights
Count reconciliation needed
Museum follow-up needed
Possible duplicate record
```

### Task fields

```ts id="1hicq5"
type ResearchTask = {
  id: string;
  object_id?: string;
  institution_id?: string;
  task_type: string;
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  status: "todo" | "in_progress" | "blocked" | "done" | "wont_do";
  source_urls?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
};
```

---

## 14. Admin review workflow

Imported records should not automatically become public if they contain unresolved data.

Add review states:

```txt id="9kwzft"
draft
imported_unreviewed
needs_review
verified
public
archived
```

Publishing rule:

```txt id="unjxnm"
Only records with confidence_level = confirmed and at least one source URL may be marked public.
```

Recommended stronger rule:

```txt id="2sjq6r"
Records with unclear 1897 status may be public only if the uncertainty badge is visible.
```

---

## 15. Validation and warning system

Add a validation layer that runs after import and on record edit.

Warnings:

```txt id="id4rd2"
confirmed object missing source
confirmed object missing accession number
confirmed object missing institution
1897 confirmed but no provenance source
restitution status present but ownership status missing
physically returned but physical location blank
image available but image rights missing
Digital Benin exact match but URL missing
museum catalogue URL missing
possible duplicate accession number within institution
possible Republic of Benin / Kingdom of Benin confusion
```

---

## 16. Atlas research update seed list

Prioritize these records from the new research pass:

```txt id="m2mes0"
Weltmuseum Wien — 64745
Weltmuseum Wien — 64789
Cambridge MAA — 532530
Cambridge MAA — 532528
Pitt Rivers Museum — 1907.66.1
National Museums Scotland — 74-object 1897-linked collection
University of Aberdeen — returned Oba head
RJM Köln — 92-object collection
RJM Köln — 17941
SKD Dresden / Leipzig — 262-object or 283-object collection
SKD Dresden — 16607
MARKK Hamburg — full Benin collection
MARKK Hamburg — C 2389
MK&G Hamburg — three Benin bronzes
GRASSI Leipzig — 87-object lead
GRASSI / SKD Leipzig — 22222
Linden-Museum Stuttgart — 70-object collection
Linden-Museum Stuttgart — 005382
Linden-Museum Stuttgart — 033284
NMVW / Wereldmuseum — 184-object research corpus
NMVW Leiden — RV-1164-1
NMVW Leiden — RV-1170-5
Wereldmuseum Rotterdam — WM-15985
Stockholm / Etnografiska museet — 39-object return list
Stockholm — 1900.01.0001
Field Museum Chicago — 393-object lead
Field Museum Chicago — FMNH 8259
Art Institute Chicago — 180750
MFA Boston — former 2013.223
MFA Boston — former 2018.223
Metropolitan Museum of Art — 1979.206.86
Metropolitan Museum of Art — 1991.17.49
Brooklyn Museum — 56.6.74
Smithsonian NMAfA — 29 returned objects / nine loaned back
National Gallery of Art — returned Fowl / cockerel
Penn Museum — 29-94-3
Barnes Foundation — Ewua figure
Cleveland Museum of Art — eight-object Benin feature
Detroit Institute of Arts — 26.180
Minneapolis Institute of Art — Benin Memorial Head
Saint Louis Art Museum — Commemorative Head
Dallas Museum of Art — single-figure plaque / three-object lead
RISD Museum — returned Oba head
Harvard Art Museums — 230607
Harvard Art Museums — 1988.472
Peabody Museum Harvard — Benin Bronzes collection
```

---

## 17. User stories

### Researcher imports new atlas data

As a researcher, I want to import an updated workbook so that the live Bloom atlas reflects my latest research without destroying existing curated records.

Acceptance criteria:

```txt id="7wzu2d"
Given an import file with existing and new records,
when I run the importer,
then existing records are updated only where safe,
and new records are created as imported_unreviewed,
and an import report is generated.
```

### Researcher checks Digital Benin match gaps

As a researcher, I want to filter objects missing Digital Benin IDs so that I can prioritize reconciliation work.

Acceptance criteria:

```txt id="e2q9ml"
Given confirmed Benin objects,
when Digital Benin match status is not_checked or not_found,
then they appear in the Digital Benin matching queue.
```

### Researcher distinguishes returned from physically present objects

As a researcher, I want to distinguish ownership transfer from physical return so that the map does not misrepresent where objects currently are.

Acceptance criteria:

```txt id="ospz6v"
Given an object marked ownership_transferred_to_nigeria,
when physical location remains a foreign museum,
then the object displays both Nigerian ownership and foreign physical location.
```

### Public viewer sees uncertainty

As a public viewer, I want uncertainty to be visible so that probable or unresolved records are not presented as confirmed facts.

Acceptance criteria:

```txt id="4e2bvb"
Given a record with unclear 1897 status,
when it is displayed publicly,
then an uncertainty badge appears near the provenance field.
```

---

## 18. Codex implementation prompt

```txt id="iqqnoz"
You are working inside the existing Digital Benin Bloom repository. The MVP is already live. Do not rebuild from scratch.

Your task is to implement the Atlas Research Update described in docs/PRD.md.

First inspect the repository and identify:
- framework
- data storage
- object model
- import pipeline
- map/atlas components
- admin/edit pages
- deployment setup

Then implement the safest incremental update.

Requirements:
1. Add atlas fields for Digital Benin matching, 1897 status, restitution status, ownership status, physical location, source URLs, image rights, and last verified date.
2. Add a safe import/update workflow for the revised Benin artefacts register.
3. Preserve existing manually curated data.
4. Add import reports showing created, updated, skipped, duplicate, and warning records.
5. Add validation warnings for missing sources, missing Digital Benin IDs, unclear ownership, unclear 1897 status, and missing image rights.
6. Add or update filters and badges in the object register and atlas views.
7. Add a Digital Benin matching queue.
8. Add a research task queue if one does not already exist.
9. Add structured provenance entities and events only if the current model lacks them; otherwise extend the existing model.
10. Add tests for importer matching, validation warnings, and non-destructive updates.

Important:
- Do not fabricate data.
- Do not mark imported records public by default.
- Do not overwrite existing curated fields unless the incoming field is explicitly newer or the existing field is blank.
- Preserve the raw imported row for auditability.
- Use the existing app style and architecture.
```

---

## 19. Acceptance checklist

The update is complete when:

```txt id="v4lxvx"
[ ] Existing live MVP still runs.
[ ] Existing records are preserved.
[ ] New atlas fields are available.
[ ] Updated workbook/CSV can be imported.
[ ] Import report is generated.
[ ] Possible duplicates are flagged.
[ ] Missing Digital Benin IDs generate tasks or warnings.
[ ] Unclear 1897 status is visibly badged.
[ ] Restitution and ownership status are separate fields.
[ ] Physical location is separate from legal ownership.
[ ] Object register has filters for Digital Benin status, 1897 status, restitution status, ownership status, and confidence.
[ ] Atlas markers summarize confirmed, unresolved, matched, returned, and physically present records.
[ ] Public records cannot silently present uncertain claims as confirmed.
[ ] Export still works or is added for updated atlas data.
```