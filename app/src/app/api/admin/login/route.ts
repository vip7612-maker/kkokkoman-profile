import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db, schema } from "@/db/client";
import { eq } from "drizzle-orm";
import { env } from "@/lib/env";
import { setSessionCookie, signSession } from "@/lib/auth";

const Body = z.object({ email: z.string().email(), password: z.string() });

export async function POST(request: Request) {
  try {
    const { email, password } = Body.parse(await request.json());

    // 1) DB의 admin 우선 확인 (있다면)
    const [admin] = await db
      .select()
      .from(schema.admins)
      .where(eq(schema.admins.email, email))
      .limit(1);

    let ok = false;
    if (admin) {
      ok = await bcrypt.compare(password, admin.passwordHash);
    } else {
      // 2) 없으면 .env 기반 fallback (시드 전 단계)
      ok = email === env.adminEmail && password === env.adminPassword;
    }
    if (!ok) {
      return NextResponse.json({ ok: false, error: "이메일 또는 비밀번호가 올바르지 않습니다" }, { status: 401 });
    }
    const token = await signSession({ email });
    await setSessionCookie(token);
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ ok: false, error: "잘못된 입력" }, { status: 400 });
    console.error(e);
    return NextResponse.json({ ok: false, error: "서버 오류" }, { status: 500 });
  }
}
