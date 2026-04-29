import { NextResponse } from "next/server";
import { z } from "zod";
import { db, schema } from "@/db/client";
import { eq } from "drizzle-orm";
import { getCurrentAdmin } from "@/lib/auth";

const Body = z.object({
  status: z.enum(["new", "contacted", "confirmed", "done", "canceled"]),
});

export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await getCurrentAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { id } = await ctx.params;
  const { status } = Body.parse(await request.json());
  await db
    .update(schema.lectureRequests)
    .set({ status })
    .where(eq(schema.lectureRequests.id, Number(id)));
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await getCurrentAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { id } = await ctx.params;
  await db
    .delete(schema.lectureRequests)
    .where(eq(schema.lectureRequests.id, Number(id)));
  return NextResponse.json({ ok: true });
}
