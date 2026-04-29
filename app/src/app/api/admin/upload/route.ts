import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { getCurrentAdmin } from "@/lib/auth";
import { db, schema } from "@/db/client";

// kind: "case" -> 이미지를 public/uploads/에 저장 (공개)
// kind: "card"|"bank"|"id" -> private/secure-files/에 저장 (비공개) + secure_files row
export async function POST(request: Request) {
  if (!(await getCurrentAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const fd = await request.formData();
  const file = fd.get("file");
  const kind = String(fd.get("kind") ?? "case");
  const label = String(fd.get("label") ?? "");
  if (!(file instanceof File)) return NextResponse.json({ ok: false, error: "파일 없음" }, { status: 400 });

  const buf = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || "";
  const id = randomUUID();
  const safeName = `${id}${ext}`;

  if (kind === "case") {
    const dir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, safeName), buf);
    return NextResponse.json({ ok: true, url: `/uploads/${safeName}` });
  }

  // 보호 파일 (강사 카드/통장/신분증)
  if (!["card", "bank", "id"].includes(kind)) {
    return NextResponse.json({ ok: false, error: "kind 오류" }, { status: 400 });
  }
  const dir = path.join(process.cwd(), "private", "secure-files");
  await fs.mkdir(dir, { recursive: true });
  const dest = path.join(dir, safeName);
  await fs.writeFile(dest, buf);

  const [row] = await db
    .insert(schema.secureFiles)
    .values({
      kind,
      label: label || file.name,
      filename: file.name,
      mimeType: file.type || "application/octet-stream",
      size: buf.length,
      storagePath: path.relative(process.cwd(), dest),
    })
    .returning({ id: schema.secureFiles.id });

  return NextResponse.json({ ok: true, id: row.id });
}
