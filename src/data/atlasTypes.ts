export type RecordLevel = "object" | "collection";
export type ConfidenceLevel = "confirmed" | "probable" | "unclear" | "exclude";
export type Expedition1897Status =
  | "confirmed_1897_looted"
  | "probable_1897_looted"
  | "possible_1897_link"
  | "benin_object_1897_unproven"
  | "not_1897_related"
  | "unclear";
export type DigitalBeninStatus =
  | "matched_exact"
  | "matched_probable"
  | "not_found"
  | "not_checked"
  | "not_in_scope";
export type OwnershipStatus =
  | "still_owned_by_holding_museum"
  | "ownership_transferred_to_nigeria"
  | "physically_returned_to_nigeria"
  | "returned_but_on_loan_back"
  | "under_restitution_review"
  | "status_unclear";

export type ValidationWarning = {
  record_id: string;
  code: string;
  field: string;
  severity: "info" | "warning" | "error";
  message: string;
};

export type AtlasRecord = {
  local_record_id: string;
  record_level: RecordLevel;
  review_state: "imported_unreviewed" | "needs_review" | "verified" | "public";
  country: string;
  city: string;
  institution_name: string;
  institution_id: string;
  latitude: number | null;
  longitude: number | null;
  coordinate_precision: "city" | "unknown";
  coordinate_source: string;
  object_title: string;
  object_type: string;
  object_type_normalized: string;
  cultural_attribution_original: string;
  cultural_attribution_normalized: string;
  date_period: string;
  material: string;
  accession_number: string;
  collection_identifier: string;
  acquisition_date: string;
  provenance_summary: string;
  provenance_confidence: ConfidenceLevel;
  confidence_level: ConfidenceLevel;
  expedition_1897_status: Expedition1897Status;
  expedition_1897_source_text: string;
  digital_benin_match_status: DigitalBeninStatus;
  digital_benin_id: string;
  digital_benin_url: string;
  digital_benin_source_text: string;
  current_ownership_status: OwnershipStatus;
  restitution_status: string;
  current_physical_location_status: string;
  current_physical_location: string;
  ownership_restitution_source_text: string;
  museum_catalogue_url: string;
  source_urls: string[];
  image_available: boolean;
  image_url: string;
  image_rights: string;
  image_credit: string;
  research_priority: "high" | "medium" | "low";
  public_notes: string;
  source_notes: string;
  last_verified_date: string;
  legacy_references: string[];
  warnings: ValidationWarning[];
};

export type InstitutionSummary = {
  institutionId: string;
  institutionName: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  records: AtlasRecord[];
  objectCount: number;
  collectionCount: number;
  confirmedCount: number;
  confirmed1897Count: number;
  unresolvedCount: number;
  digitalBeninMatchedCount: number;
  ownershipTransferredCount: number;
  physicallyReturnedCount: number;
  stillPresentCount: number;
  warningCount: number;
};
