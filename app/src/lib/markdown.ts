// 가벼운 마크다운 렌더러 (헤딩/굵게/이탤릭/링크/리스트/이미지/인용/줄바꿈)
// 외부 의존성 없이, 강의 사례 본문 정도의 단순 포맷에 대응.

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function inline(s: string) {
  // 이미지 ![alt](url)
  s = s.replace(
    /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
    (_m, alt, url, _t) =>
      `<img src="${escapeHtml(url)}" alt="${escapeHtml(alt)}" loading="lazy" />`,
  );
  // 링크 [text](url)
  s = s.replace(
    /\[([^\]]+)\]\(([^)\s]+)\)/g,
    (_m, t, u) =>
      `<a href="${escapeHtml(u)}" target="_blank" rel="noopener noreferrer" class="underline">${escapeHtml(
        t,
      )}</a>`,
  );
  // 굵게
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // 이탤릭
  s = s.replace(/(^|\W)\*([^*\n]+)\*(?=\W|$)/g, "$1<em>$2</em>");
  return s;
}

export function renderMarkdown(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let inList: "ul" | "ol" | null = null;
  let inQuote = false;
  let buf: string[] = [];

  const flushPara = () => {
    if (buf.length) {
      out.push(`<p>${inline(escapeHtml(buf.join(" ")))}</p>`);
      buf = [];
    }
  };
  const closeList = () => {
    if (inList) {
      out.push(`</${inList}>`);
      inList = null;
    }
  };
  const closeQuote = () => {
    if (inQuote) {
      out.push(`</blockquote>`);
      inQuote = false;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushPara();
      closeList();
      closeQuote();
      continue;
    }
    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    if (h) {
      flushPara();
      closeList();
      closeQuote();
      const lvl = h[1].length + 1;
      out.push(`<h${lvl}>${inline(escapeHtml(h[2]))}</h${lvl}>`);
      continue;
    }
    const ul = /^[-*]\s+(.*)$/.exec(line);
    const ol = /^\d+\.\s+(.*)$/.exec(line);
    if (ul || ol) {
      flushPara();
      closeQuote();
      const tag = ul ? "ul" : "ol";
      if (inList !== tag) {
        closeList();
        out.push(`<${tag}>`);
        inList = tag;
      }
      out.push(`<li>${inline(escapeHtml((ul ?? ol)![1]))}</li>`);
      continue;
    }
    closeList();
    if (/^>\s?/.test(line)) {
      if (!inQuote) {
        out.push(`<blockquote>`);
        inQuote = true;
      }
      out.push(`<p>${inline(escapeHtml(line.replace(/^>\s?/, "")))}</p>`);
      continue;
    }
    closeQuote();
    buf.push(line);
  }
  flushPara();
  closeList();
  closeQuote();
  return out.join("\n");
}
