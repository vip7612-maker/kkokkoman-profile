import { describe, expect, it } from "vitest";
import { renderMarkdown } from "@/lib/markdown";

describe("renderMarkdown", () => {
  it("renders headings, lists, bold, link, image", () => {
    const md = `## 제목\n안녕하세요 **꼬꼬맨**.\n- 항목1\n- [링크](https://example.com)\n\n![alt](/x.jpg)`;
    const html = renderMarkdown(md);
    expect(html).toContain("<h3>제목</h3>");
    expect(html).toContain("<strong>꼬꼬맨</strong>");
    expect(html).toContain('<a href="https://example.com"');
    expect(html).toContain('<img src="/x.jpg"');
    expect(html).toContain("<li>항목1</li>");
  });

  it("escapes html in plain text", () => {
    const html = renderMarkdown("나쁜 <script>alert(1)</script> 시도");
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("renders blockquote", () => {
    const html = renderMarkdown("> 인용된 한 줄");
    expect(html).toContain("<blockquote>");
    expect(html).toContain("인용된 한 줄");
  });
});
