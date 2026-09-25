import { describe, expect, it } from "vitest";
import { pluralizeObject } from "@/lib/pluralize";

describe("archive count wording", () => {
  it.each([
    [0, "objects"],
    [1, "object"],
    [2, "objects"],
  ])("uses the correct noun for %i", (count, expected) => {
    expect(pluralizeObject(count)).toBe(expected);
  });
});
