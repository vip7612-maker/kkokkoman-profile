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
  published: z.boolean().optional(),
});

export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await getCurrentAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await ctx.params;
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
      ...(data.published !== undefined ? { published: data.published } : {}),
    })
    .where(eq(schema.cases.id, Number(id)));
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
