// 강사 카드 PDF + 강의 제안서 PDF를 Vercel Blob에 (재)업로드하고
// secure_files 테이블을 갱신한다.
import "./_env";
import { put, del as blobDel } from "@vercel/blob";
import { promises as fs } from "node:fs";
import path from "node:path";
import { db, schema } from "../src/db/client";
import { and, eq } from "drizzle-orm";

type SeedFile = {
  kind: "proposal" | "card";
  label: string;
  filename: string;
  mimeType: string;
  filePath: string;
  isPublic: boolean;
  // 더미 row 정리용
  replaceLabels?: string[];
};

const FILES: SeedFile[] = [
  {
    kind: "proposal",
    label: "강의 제안서 (연주하는 꼬꼬맨 / 김춘흥)",
    filename: "강의제안서_연주하는꼬꼬맨_김춘흥.pdf",
    mimeType: "application/pdf",
    filePath: path.resolve(__dirname, "proposal-output", "proposal.pdf"),
    isPublic: true,
  },
  {
    kind: "card",
    label: "강사 관리카드 (연주하는 꼬꼬맨 / 김춘흥)",
    filename: "강사관리카드_연주하는꼬꼬맨_김춘흥.docx",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    filePath: path.resolve(__dirname, "proposal-output", "instructor-card.docx"),
    isPublic: false,
    // 기존 더미/PDF 강사카드 row(s)를 삭제 대상에 포함
    replaceLabels: ["강사카드"],
  },
];

async function upsert(f: SeedFile) {
  const buf = await fs.readFile(f.filePath);
  console.log(`[${f.kind}] preparing: ${f.filename} (${(buf.length / 1024).toFixed(1)} KB)`);

  // 1) 기존 row(들) 정리 — 같은 label 또는 replaceLabels 매칭
  const labelsToDel = [f.label, ...(f.replaceLabels ?? [])];
  for (const lbl of labelsToDel) {
    const existing = await db
      .select()
      .from(schema.secureFiles)
      .where(and(eq(schema.secureFiles.kind, f.kind), eq(schema.secureFiles.label, lbl)));
    for (const row of existing) {
      // Blob 삭제 시도
      if (/^https?:\/\//i.test(row.storagePath)) {
        try {
          await blobDel(row.storagePath);
          console.log(`  - removed blob for old row id=${row.id} (label=${lbl})`);
        } catch (e) {
          console.warn(`  ! blob del failed (id=${row.id}):`, (e as Error).message);
        }
      }
      await db.delete(schema.secureFiles).where(eq(schema.secureFiles.id, row.id));
      console.log(`  - removed db row id=${row.id} (label=${lbl})`);
    }
  }

  // 2) Blob 업로드
  const folder = f.kind === "proposal" ? "proposals" : "secure";
  const blobPath = `${folder}/${f.filename}`;
  const blob = await put(blobPath, buf, {
    access: "public",
    addRandomSuffix: f.kind !== "proposal", // 보호 파일은 random suffix
    contentType: f.mimeType,
  });
  console.log(`  - blob url: ${blob.url}`);

  // 3) DB row 등록
  const [row] = await db
    .insert(schema.secureFiles)
    .values({
      kind: f.kind,
      label: f.label,
      filename: f.filename,
      mimeType: f.mimeType,
      size: buf.length,
      storagePath: blob.url,
      isPublic: f.isPublic,
    })
    .returning({ id: schema.secureFiles.id });
  console.log(`  - inserted db row id=${row.id}`);
}

async function main() {
  for (const f of FILES) {
    await upsert(f);
  }
  console.log("\n[done] all files uploaded.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
