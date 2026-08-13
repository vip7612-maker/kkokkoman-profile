// 사용자가 대략적으로 적은 글(줄바꿈, 글머리표 섞임)을
// 가벼운 마크다운 본문으로 정리한다.
//
// 규칙
// - 빈 줄(이중 줄바꿈)은 단락 구분 → 그대로 유지
// - 단일 줄바꿈은 같은 단락으로 합침(스페이스 결합)
// - "•", "·", "-", "*", "—" 로 시작하는 줄은 마크다운 리스트(-)
// - "1) 항목" / "1. 항목" / "1)항목" 은 번호 리스트(1. )
// - "# 제목" 그대로 유지
// - 그 외 한 줄짜리 짧은 라인은 단락 그대로

function normalizeBullet(line: string): string | null {
  const m = /^\s*([•·–—*•·\-])\s+(.+)$/.exec(line);
  if (m) return `- ${m[2].trim()}`;
  return null;
}

function normalizeOrdered(line: string): string | null {
  const m = /^\s*(\d+)\s*[).]\s*(.+)$/.exec(line);
  if (m) return `${m[1]}. ${m[2].trim()}`;
  return null;
}

export function draftToMarkdown(input: string): string {
  if (!input.trim()) return "";
  const normalized = input.replace(/\r\n/g, "\n").replace(/ /g, " ");
  const blocks = normalized
    .split(/\n{2,}/)
    .map((b) => b.replace(/\s+$/g, "").replace(/^\s+/g, ""))
    .filter(Boolean);

  const out: string[] = [];
  for (const block of blocks) {
    const lines = block.split("\n").map((l) => l.trimEnd());
    const transformed: string[] = [];
    let mode: "list" | "para" | null = null;
    let paraBuf: string[] = [];
    const flushPara = () => {
      if (paraBuf.length) {
        transformed.push(paraBuf.join(" ").trim());
        paraBuf = [];
      }
    };
    for (const raw of lines) {
      if (!raw.trim()) continue;
      if (/^#{1,3}\s+/.test(raw)) {
        flushPara();
        mode = null;
        transformed.push(raw.trim());
        continue;
      }
      const ul = normalizeBullet(raw);
      const ol = ul ? null : normalizeOrdered(raw);
      if (ul || ol) {
        flushPara();
        mode = "list";
        transformed.push((ul ?? ol)!);
        continue;
      }
      if (mode === "list") {
        // 리스트 사이의 일반 줄은 새 단락으로
        flushPara();
        mode = "para";
      } else {
        mode = "para";
      }
      paraBuf.push(raw.trim());
    }
    flushPara();
    out.push(transformed.join("\n"));
  }
  return out.join("\n\n");
}
