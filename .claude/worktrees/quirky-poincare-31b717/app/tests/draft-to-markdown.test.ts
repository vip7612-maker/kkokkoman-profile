import { describe, expect, it } from "vitest";
import { draftToMarkdown } from "@/lib/draft-to-markdown";

describe("draftToMarkdown", () => {
  it("merges single-line breaks within a paragraph", () => {
    const md = draftToMarkdown("첫째 줄\n둘째 줄\n셋째 줄");
    expect(md).toBe("첫째 줄 둘째 줄 셋째 줄");
  });

  it("keeps double line breaks as paragraph break", () => {
    const md = draftToMarkdown("단락 1\n\n단락 2");
    expect(md).toBe("단락 1\n\n단락 2");
  });

  it("converts • · 등 글머리표를 - 로", () => {
    const md = draftToMarkdown("• 항목 가\n· 항목 나\n- 항목 다");
    expect(md).toContain("- 항목 가");
    expect(md).toContain("- 항목 나");
    expect(md).toContain("- 항목 다");
  });

  it("normalizes 1) 와 1. 모두 번호 리스트로", () => {
    const md = draftToMarkdown("1) 첫번째\n2. 두번째");
    expect(md).toContain("1. 첫번째");
    expect(md).toContain("2. 두번째");
  });

  it("preserves markdown headings", () => {
    const md = draftToMarkdown("## 강의 후기\n오늘은 좋았다.");
    expect(md).toContain("## 강의 후기");
    expect(md).toContain("오늘은 좋았다.");
  });

  it("empty input → empty output", () => {
    expect(draftToMarkdown("")).toBe("");
    expect(draftToMarkdown("   \n   ")).toBe("");
  });
});
