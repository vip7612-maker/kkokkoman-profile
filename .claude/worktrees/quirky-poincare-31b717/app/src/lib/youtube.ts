// YouTube URL → 비디오 ID 추출 / 임베드 URL 생성

const PATTERNS = [
  // https://www.youtube.com/watch?v=ID
  /[?&]v=([a-zA-Z0-9_-]{11})/,
  // https://youtu.be/ID
  /youtu\.be\/([a-zA-Z0-9_-]{11})/,
  // https://www.youtube.com/embed/ID
  /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  // https://www.youtube.com/shorts/ID
  /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  // https://www.youtube.com/live/ID
  /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
];

export function extractYouTubeId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  // 그 자체가 11자리 ID인 경우
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  for (const re of PATTERNS) {
    const m = re.exec(trimmed);
    if (m?.[1]) return m[1];
  }
  return null;
}

export function youtubeEmbedUrl(input: string): string | null {
  const id = extractYouTubeId(input);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}
