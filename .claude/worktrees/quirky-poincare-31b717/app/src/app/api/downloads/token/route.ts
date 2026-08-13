import { NextResponse } from "next/server";
import { z } from "zod";
import { db, schema } from "@/db/client";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { issueDownloadToken } from "@/lib/download-token";
import { getDownloadPasswordStored } from "@/lib/site-settings";

const Body = z.object({ fileId: z.number().int(), password: z.string() });

export async function POST(request: Request) {
  try {
    const { fileId, password } = Body.parse(await request.json());

    const { value: stored } = await getDownloadPasswordStored();
    const valid = stored.startsWith("$2")
      ? await bcrypt.compare(password, stored)
      : password === stored;

    if (!valid) {
      return NextResponse.json({ ok: false, error: "비밀번호가 올바르지 않습니다" }, { status: 401 });
    }

    const [file] = await db
      .select()
      .from(schema.secureFiles)
      .where(eq(schema.secureFiles.id, fileId))
      .limit(1);
    if (!file) {
      return NextResponse.json({ ok: false, error: "파일을 찾을 수 없습니다" }, { status: 404 });
    }

    const token = await issueDownloadToken(file.id);
    return NextResponse.json({ ok: true, token });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: "잘못된 요청" }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ ok: false, error: "서버 오류" }, { status: 500 });
  }
}
