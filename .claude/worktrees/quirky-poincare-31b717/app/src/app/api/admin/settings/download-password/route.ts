import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getCurrentAdmin } from "@/lib/auth";
import {
  SETTING_KEYS,
  deleteSetting,
  getDownloadPasswordStored,
  setSetting,
} from "@/lib/site-settings";

const PutBody = z.object({
  password: z.string().min(4, "비밀번호는 최소 4자 이상이어야 합니다"),
});

export async function GET() {
  if (!(await getCurrentAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { source } = await getDownloadPasswordStored();
  return NextResponse.json({ ok: true, source });
}

export async function PUT(request: Request) {
  if (!(await getCurrentAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  try {
    const { password } = PutBody.parse(await request.json());
    const hash = await bcrypt.hash(password, 10);
    await setSetting(SETTING_KEYS.downloadPassword, hash);
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: e.issues[0]?.message ?? "잘못된 입력" },
        { status: 400 },
      );
    }
    console.error(e);
    return NextResponse.json({ ok: false, error: "서버 오류" }, { status: 500 });
  }
}

export async function DELETE() {
  if (!(await getCurrentAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  await deleteSetting(SETTING_KEYS.downloadPassword);
  return NextResponse.json({ ok: true });
}
