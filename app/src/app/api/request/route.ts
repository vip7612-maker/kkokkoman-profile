import { NextResponse } from "next/server";
import { z } from "zod";
import { db, schema } from "@/db/client";
import { renderLectureRequestHtml, sendMail } from "@/lib/mailer";
import { env } from "@/lib/env";

const Body = z.object({
  organization: z.string().min(1),
  contactName: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  audience: z.string().min(1),
  headcount: z.number().int().positive(),
  budget: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
  dates: z
    .array(
      z.object({
        date: z.string().min(1),
        timeFrom: z.string().optional().nullable(),
        timeTo: z.string().optional().nullable(),
        location: z.string().optional().nullable(),
      }),
    )
    .min(1, "희망 일정을 1개 이상 입력해주세요"),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = Body.parse(json);

    const [inserted] = await db
      .insert(schema.lectureRequests)
      .values({
        organization: data.organization,
        contactName: data.contactName,
        phone: data.phone,
        email: data.email,
        audience: data.audience,
        headcount: data.headcount,
        budget: data.budget ?? null,
        message: data.message ?? null,
      })
      .returning({ id: schema.lectureRequests.id });

    if (data.dates.length) {
      await db.insert(schema.lectureRequestDates).values(
        data.dates.map((d) => ({
          requestId: inserted.id,
          date: d.date,
          timeFrom: d.timeFrom || null,
          timeTo: d.timeTo || null,
          location: d.location || null,
        })),
      );
    }

    const html = renderLectureRequestHtml({
      organization: data.organization,
      contactName: data.contactName,
      phone: data.phone,
      email: data.email,
      audience: data.audience,
      headcount: data.headcount,
      budget: data.budget,
      message: data.message,
      dates: data.dates,
    });

    await sendMail({
      to: env.instructorEmail,
      subject: `[꼬꼬맨] 강의 요청 — ${data.organization} (${data.contactName})`,
      html,
      replyTo: data.email,
    });

    return NextResponse.json({ ok: true, id: inserted.id });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "입력값 확인", issues: e.issues },
        { status: 400 },
      );
    }
    console.error(e);
    return NextResponse.json({ ok: false, error: "서버 오류" }, { status: 500 });
  }
}
