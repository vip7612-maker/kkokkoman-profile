import { describe, expect, it } from "vitest";
import { issueDownloadToken, verifyDownloadToken } from "@/lib/download-token";

describe("download token", () => {
  it("round-trips a fileId", async () => {
    const t = await issueDownloadToken(42);
    const verified = await verifyDownloadToken(t);
    expect(verified?.fileId).toBe(42);
  });

  it("rejects garbage", async () => {
    const r = await verifyDownloadToken("not-a-token");
    expect(r).toBeNull();
  });
});
