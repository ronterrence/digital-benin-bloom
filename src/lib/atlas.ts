import type { AtlasRecord, InstitutionSummary } from "@/data/atlasTypes";

export const ATLAS_LABELS: Record<string, string> = {
  object: "Object",
  collection: "Collection lead",
  confirmed: "Confirmed",
  probable: "Probable",
  unclear: "Unclear",
  imported_unreviewed: "Imported — needs review",
  confirmed_1897_looted: "Confirmed 1897 link",
  probable_1897_looted: "Probable 1897 link",
  possible_1897_link: "Possible 1897 link",
  benin_object_1897_unproven: "1897 link unproven",
  not_1897_related: "Not 1897 related",
  matched_exact: "Digital Benin matched",
  matched_probable: "Probable Digital Benin match",
  not_checked: "Digital Benin not checked",
  not_found: "Not found on Digital Benin",
  not_in_scope: "Digital Benin not in scope",
  ownership_transferred_to_nigeria: "Ownership transferred",
  physically_returned_to_nigeria: "Physically returned",
  returned_but_on_loan_back: "Returned, on loan back",
  under_restitution_review: "Under review",
  still_owned_by_holding_museum: "Still held",
  status_unclear: "Ownership unclear",
  ownership_transferred: "Ownership transferred",
  physically_returned: "Physically returned",
  loaned_back: "Loaned back",
  under_review: "Under review",
  not_started: "Not started",
};

export function label(value: string): string {
  return ATLAS_LABELS[value] ?? value.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
}

export function summarizeInstitutions(records: AtlasRecord[]): InstitutionSummary[] {
  const groups = new Map<string, AtlasRecord[]>();
  records.forEach((record) => groups.set(record.institution_id, [...(groups.get(record.institution_id) ?? []), record]));
  return [...groups.values()]
    .filter((items) => items[0].latitude !== null && items[0].longitude !== null)
    .map((items) => {
      const first = items[0];
      return {
        institutionId: first.institution_id,
        institutionName: first.institution_name,
        city: first.city,
        country: first.country,
        latitude: first.latitude!,
        longitude: first.longitude!,
        records: items,
        objectCount: items.filter((r) => r.record_level === "object").length,
        collectionCount: items.filter((r) => r.record_level === "collection").length,
        confirmedCount: items.filter((r) => r.confidence_level === "confirmed").length,
        confirmed1897Count: items.filter((r) => r.expedition_1897_status === "confirmed_1897_looted").length,
        unresolvedCount: items.filter((r) => r.confidence_level !== "confirmed" || r.expedition_1897_status === "unclear").length,
        digitalBeninMatchedCount: items.filter((r) => r.digital_benin_match_status.startsWith("matched")).length,
        ownershipTransferredCount: items.filter((r) => r.current_ownership_status !== "status_unclear" && r.current_ownership_status !== "still_owned_by_holding_museum").length,
        physicallyReturnedCount: items.filter((r) => r.current_physical_location_status === "nigeria").length,
        stillPresentCount: items.filter((r) => r.current_physical_location_status === "holding_institution_or_loan").length,
        warningCount: items.reduce((sum, r) => sum + r.warnings.filter((w) => w.severity !== "info").length, 0),
      };
    })
    .sort((a, b) => a.institutionName.localeCompare(b.institutionName));
}

function csvCell(value: unknown): string {
  const stringValue = Array.isArray(value) ? value.join(" | ") : String(value ?? "");
  return `"${stringValue.replace(/"/g, '""')}"`;
}

export function recordsToCsv(records: AtlasRecord[]): string {
  const fields: (keyof AtlasRecord)[] = [
    "local_record_id", "record_level", "country", "city", "institution_name",
    "object_title", "object_type", "accession_number", "collection_identifier",
    "confidence_level", "expedition_1897_status", "digital_benin_match_status",
    "current_ownership_status", "restitution_status", "current_physical_location",
    "museum_catalogue_url", "digital_benin_url",
  ];
  return [fields.map(csvCell).join(","), ...records.map((record) => fields.map((field) => csvCell(record[field])).join(","))].join("\r\n");
}
