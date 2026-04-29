// 강의 제안서 PDF를 Vercel Blob에 업로드하고 secure_files에 등록한다.
// 한 번만 실행하면 충분 (이미 등록되어 있으면 skip).
import "./_env";
import { put } from "@vercel/blob";
import { promises as fs } from "node:fs";
import path from "node:path";
import { db, schema } from "../src/db/client";
import { and, eq } from "drizzle-orm";

async function main() {
  const pdfPath = path.resolve(
    __dirname,
    "proposal-output",
    "proposal.pdf",
  );
  const buf = await fs.readFile(pdfPath);
  const filename = "강의제안서_연주하는꼬꼬맨_김춘흥.pdf";
  const label = "강의 제안서 (연주하는 꼬꼬맨 / 김춘흥)";

  // 이미 같은 라벨로 등록된 게 있으면 skip
  const exist = await db
    .select()
    .from(schema.secureFiles)
    .where(
      and(
        eq(schema.secureFiles.kind, "proposal"),
        eq(schema.secureFiles.label, label),
      ),
    )
    .limit(1);
  if (exist.length > 0) {
    console.log("[proposal] already exists:", exist[0]);
    return;
  }

  console.log("[proposal] uploading to Vercel Blob…");
  const blob = await put(`proposals/${filename}`, buf, {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/pdf",
  });
  console.log("[proposal] blob url:", blob.url);

  const [row] = await db
    .insert(schema.secureFiles)
    .values({
      kind: "proposal",
      label,
      filename,
      mimeType: "application/pdf",
      size: buf.length,
      storagePath: blob.url,
      isPublic: true,
    })
    .returning({ id: schema.secureFiles.id });
  console.log("[proposal] inserted db row id =", row.id);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
