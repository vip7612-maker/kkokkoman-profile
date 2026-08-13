import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { getCurrentAdmin } from "@/lib/auth";
import { db, schema } from "@/db/client";

// kind:
//   "case"                       → 강의사례 이미지 (URL 그대로 노출 OK)
//   "proposal"                   → 강의 제안서 (공개 다운로드, 비번 불필요, isPublic=true)
//   "card" | "bank" | "id"       → 보호 파일 (random suffix + 비번 인증 필요)
const SECURE_KINDS = ["card", "bank", "id"] as const;
const PUBLIC_KINDS = ["proposal"] as const;

export async function POST(request: Request) {
  if (!(await getCurrentAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const fd = await request.formData();
  const file = fd.get("file");
  const kind = String(fd.get("kind") ?? "case");
  const label = String(fd.get("label") ?? "");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "파일 없음" }, { status: 400 });
  }

  const ext = path.extname(file.name) || "";
  const id = randomUUID();
  const folder =
    kind === "case" ? "cases" : kind === "proposal" ? "proposals" : "secure";
  const blobPath = `${folder}/${id}${ext}`;

  // 보호 파일은 random suffix 추가 (URL 추측 방지)
  const isSecure = (SECURE_KINDS as readonly string[]).includes(kind);
  const blob = await put(blobPath, file, {
    access: "public",
    addRandomSuffix: isSecure,
    contentType: file.type || "application/octet-stream",
  });

  if (kind === "case") {
    return NextResponse.json({ ok: true, url: blob.url });
  }

  if (
    !(SECURE_KINDS as readonly string[]).includes(kind) &&
    !(PUBLIC_KINDS as readonly string[]).includes(kind)
  ) {
    return NextResponse.json({ ok: false, error: "kind 오류" }, { status: 400 });
  }

  const isPublic = (PUBLIC_KINDS as readonly string[]).includes(kind);

  const [row] = await db
    .insert(schema.secureFiles)
    .values({
      kind,
      label: label || file.name,
      filename: file.name,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
      storagePath: blob.url,
      isPublic,
    })
    .returning({ id: schema.secureFiles.id });

  return NextResponse.json({ ok: true, id: row.id });
}
