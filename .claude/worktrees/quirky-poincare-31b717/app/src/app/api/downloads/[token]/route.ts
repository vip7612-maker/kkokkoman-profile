import { NextResponse } from "next/server";
import { db, schema } from "@/db/client";
import { eq } from "drizzle-orm";
import { promises as fs } from "node:fs";
import path from "node:path";
import { verifyDownloadToken } from "@/lib/download-token";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ token: string }> },
) {
  const { token } = await ctx.params;
  const decoded = await verifyDownloadToken(token);
  if (!decoded) {
    return NextResponse.json(
      { ok: false, error: "토큰이 만료되었거나 유효하지 않습니다" },
      { status: 401 },
    );
  }

  const [file] = await db
    .select()
    .from(schema.secureFiles)
    .where(eq(schema.secureFiles.id, decoded.fileId))
    .limit(1);
  if (!file) return NextResponse.json({ ok: false }, { status: 404 });

  // storagePath가 http(s):// 면 Vercel Blob, 아니면 로컬 FS
  const isRemote = /^https?:\/\//i.test(file.storagePath);

  let buf: Buffer;
  if (isRemote) {
    const res = await fetch(file.storagePath);
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: "파일을 가져오지 못했습니다" },
        { status: 502 },
      );
    }
    buf = Buffer.from(await res.arrayBuffer());
  } else {
    const abs = path.isAbsolute(file.storagePath)
      ? file.storagePath
      : path.join(process.cwd(), file.storagePath);
    try {
      buf = await fs.readFile(abs);
    } catch {
      return NextResponse.json(
        { ok: false, error: "파일 본체를 찾을 수 없습니다" },
        { status: 404 },
      );
    }
  }

  await db.insert(schema.downloadLogs).values({ fileId: file.id });
  const body = new Uint8Array(buf);
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": file.mimeType,
      "Content-Length": String(body.byteLength),
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(
        file.filename,
      )}`,
      "Cache-Control": "no-store",
    },
  });
}
