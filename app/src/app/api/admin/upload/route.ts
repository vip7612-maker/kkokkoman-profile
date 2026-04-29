import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { getCurrentAdmin } from "@/lib/auth";
import { db, schema } from "@/db/client";

// kind:
//   "case"               → public Blob: 강의사례 이미지 (URL 그대로 노출 OK)
//   "card" | "bank" | "id" → public Blob (random suffix) but URL은 DB에만 저장
//                            클라이언트엔 절대 노출하지 않고 다운로드 라우트에서 프록시
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
  const folder = kind === "case" ? "cases" : "secure";
  const blobPath = `${folder}/${id}${ext}`;

  const blob = await put(blobPath, file, {
    access: "public",
    addRandomSuffix: kind !== "case", // 보안 파일은 추측 어렵게 random suffix 추가
    contentType: file.type || "application/octet-stream",
  });

  if (kind === "case") {
    return NextResponse.json({ ok: true, url: blob.url });
  }

  if (!["card", "bank", "id"].includes(kind)) {
    return NextResponse.json({ ok: false, error: "kind 오류" }, { status: 400 });
  }

  const [row] = await db
    .insert(schema.secureFiles)
    .values({
      kind,
      label: label || file.name,
      filename: file.name,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
      storagePath: blob.url, // Blob URL을 storagePath에 저장
    })
    .returning({ id: schema.secureFiles.id });

  return NextResponse.json({ ok: true, id: row.id });
}
