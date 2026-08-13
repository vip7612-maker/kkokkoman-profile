import { describe, expect, it } from "vitest";
import { extractYouTubeId, youtubeEmbedUrl } from "@/lib/youtube";

describe("extractYouTubeId", () => {
  it("watch URL", () => {
    expect(extractYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });
  it("short URL", () => {
    expect(extractYouTubeId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });
  it("embed URL", () => {
    expect(extractYouTubeId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });
  it("shorts URL", () => {
    expect(extractYouTubeId("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });
  it("bare ID", () => {
    expect(extractYouTubeId("dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });
  it("invalid", () => {
    expect(extractYouTubeId("https://example.com/not-a-yt")).toBeNull();
    expect(extractYouTubeId("")).toBeNull();
  });
});

describe("youtubeEmbedUrl", () => {
  it("builds embed", () => {
    expect(youtubeEmbedUrl("https://youtu.be/dQw4w9WgXcQ")).toBe(
      "https://www.youtube.com/embed/dQw4w9WgXcQ",
    );
  });
  it("null on bad input", () => {
    expect(youtubeEmbedUrl("nope")).toBeNull();
  });
});
