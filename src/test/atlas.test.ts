import atlasJson from "../../data/normalized/atlas_public_records.json";
import type { AtlasRecord } from "@/data/atlasTypes";
import { recordsToCsv, summarizeInstitutions } from "@/lib/atlas";

const records = atlasJson as AtlasRecord[];

describe("atlas data", () => {
  it("contains the expected object and collection records", () => {
    expect(records).toHaveLength(45);
    expect(records.filter((record) => record.record_level === "object")).toHaveLength(30);
    expect(records.filter((record) => record.record_level === "collection")).toHaveLength(15);
  });

  it("aggregates institution summaries without conflating collections and objects", () => {
    const summaries = summarizeInstitutions(records);
    expect(summaries.length).toBeGreaterThan(20);
    expect(summaries.reduce((sum, item) => sum + item.objectCount, 0)).toBe(30);
    expect(summaries.reduce((sum, item) => sum + item.collectionCount, 0)).toBe(15);
  });

  it("escapes CSV values", () => {
    const csv = recordsToCsv([{ ...records[0], object_title: 'Head, called "royal"' }]);
    expect(csv).toContain('"Head, called ""royal"""');
  });
});
