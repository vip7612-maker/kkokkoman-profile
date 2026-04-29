import { NextResponse } from "next/server";
import { db, schema } from "@/db/client";
import { and, eq } from "drizzle-orm";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const [file] = await db
    .select()
    .from(schema.secureFiles)
    .where(
      and(
        eq(schema.secureFiles.id, Number(id)),
        eq(schema.secureFiles.isPublic, true),
      ),
    )
    .limit(1);
  if (!file) return NextResponse.json({ ok: false }, { status: 404 });

  if (!/^https?:\/\//i.test(file.storagePath)) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }
  const res = await fetch(file.storagePath);
  if (!res.ok) {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await db.insert(schema.downloadLogs).values({ fileId: file.id });

  const body = new Uint8Array(buf);
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": file.mimeType,
      "Content-Length": String(body.byteLength),
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(file.filename)}`,
      "Cache-Control": "no-store",
    },
  });
}
