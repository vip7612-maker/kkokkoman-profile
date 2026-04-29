import { NextResponse } from "next/server";
import { z } from "zod";
import { db, schema } from "@/db/client";
import { getCurrentAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const Body = z.object({
  slug: z.string().optional(),
  title: z.string().min(1),
  summary: z.string().min(1),
  coverImage: z.string().optional().nullable(),
  bodyMd: z.string().min(1),
  orgName: z.string().optional().nullable(),
  lecturedAt: z.string().optional().nullable(),
  published: z.boolean().optional(),
});

export async function POST(request: Request) {
  if (!(await getCurrentAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    const data = Body.parse(await request.json());
    const baseSlug = (data.slug && data.slug.trim()) || slugify(data.title);
    let slug = baseSlug;
    let n = 2;
    // unique slug
    while (true) {
      const existing = await db
        .select({ id: schema.cases.id })
        .from(schema.cases)
        .where(eqSlug(slug));
      if (existing.length === 0) break;
      slug = `${baseSlug}-${n++}`;
    }
    const [row] = await db
      .insert(schema.cases)
      .values({
        slug,
        title: data.title,
        summary: data.summary,
        coverImage: data.coverImage || null,
        bodyMd: data.bodyMd,
        orgName: data.orgName || null,
        lecturedAt: data.lecturedAt || null,
        published: data.published ?? true,
      })
      .returning({ id: schema.cases.id, slug: schema.cases.slug });
    return NextResponse.json({ ok: true, ...row });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: "입력값 확인" }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ ok: false, error: "서버 오류" }, { status: 500 });
  }
}

import { eq } from "drizzle-orm";
function eqSlug(s: string) {
  return eq(schema.cases.slug, s);
}
