import { describe, expect, it } from "vitest";
import { slugify, formatDateKo } from "@/lib/utils";

describe("slugify", () => {
  it("creates url-safe slug from korean title", () => {
    expect(slugify("상지대학교 사회복지학과 - 음악으로!")).toBe(
      "상지대학교-사회복지학과-음악으로",
    );
  });
  it("falls back when input is empty", () => {
    expect(slugify("!!!")).toMatch(/^case-\d+$/);
  });
});

describe("formatDateKo", () => {
  it("formats date string", () => {
    const out = formatDateKo("2025-11-10");
    expect(out).toContain("2025");
    expect(out).toContain("11");
  });
});
