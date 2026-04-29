import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { db, schema } from "@/db/client";
import { eq } from "drizzle-orm";
import { getCurrentAdmin } from "@/lib/auth";

export async function DELETE(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await getCurrentAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await ctx.params;
  const [row] = await db
    .select()
    .from(schema.secureFiles)
    .where(eq(schema.secureFiles.id, Number(id)))
    .limit(1);
  if (row) {
    const abs = path.isAbsolute(row.storagePath)
      ? row.storagePath
      : path.join(process.cwd(), row.storagePath);
    try { await fs.unlink(abs); } catch {}
  }
  await db.delete(schema.secureFiles).where(eq(schema.secureFiles.id, Number(id)));
  return NextResponse.json({ ok: true });
}
