import { NextResponse } from "next/server";
import { z } from "zod";
import { db, schema } from "@/db/client";
import { eq } from "drizzle-orm";
import { getCurrentAdmin } from "@/lib/auth";

const Body = z.object({
  slug: z.string().optional(),
  title: z.string().min(1).optional(),
  summary: z.string().min(1).optional(),
  coverImage: z.string().optional().nullable(),
  bodyMd: z.string().min(1).optional(),
  orgName: z.string().optional().nullable(),
  lecturedAt: z.string().optional().nullable(),
  youtubeUrl: z.string().optional().nullable(),
  galleryImages: z.array(z.string()).max(3).optional(),
  published: z.boolean().optional(),
});

export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await getCurrentAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await ctx.params;
  const caseId = Number(id);
  const data = Body.parse(await request.json());
  await db
    .update(schema.cases)
    .set({
      ...(data.slug !== undefined ? { slug: data.slug } : {}),
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.summary !== undefined ? { summary: data.summary } : {}),
      ...(data.coverImage !== undefined ? { coverImage: data.coverImage || null } : {}),
      ...(data.bodyMd !== undefined ? { bodyMd: data.bodyMd } : {}),
      ...(data.orgName !== undefined ? { orgName: data.orgName || null } : {}),
      ...(data.lecturedAt !== undefined ? { lecturedAt: data.lecturedAt || null } : {}),
      ...(data.youtubeUrl !== undefined ? { youtubeUrl: data.youtubeUrl || null } : {}),
      ...(data.published !== undefined ? { published: data.published } : {}),
    })
    .where(eq(schema.cases.id, caseId));

  if (data.galleryImages !== undefined) {
    await db.delete(schema.caseImages).where(eq(schema.caseImages.caseId, caseId));
    const gallery = data.galleryImages
      .map((u) => u.trim())
      .filter(Boolean)
      .slice(0, 3);
    if (gallery.length) {
      await db.insert(schema.caseImages).values(
        gallery.map((url, idx) => ({
          caseId,
          url,
          sortOrder: idx,
        })),
      );
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await getCurrentAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await ctx.params;
  await db.delete(schema.cases).where(eq(schema.cases.id, Number(id)));
  return NextResponse.json({ ok: true });
}
