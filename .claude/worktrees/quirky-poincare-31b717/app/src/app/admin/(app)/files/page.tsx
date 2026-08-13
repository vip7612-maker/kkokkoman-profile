import { db, schema } from "@/db/client";
import { asc } from "drizzle-orm";
import { FilesManager } from "@/components/admin/files-manager";
import { DownloadPasswordForm } from "@/components/admin/download-password-form";
import { getDownloadPasswordStored } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function AdminFilesPage() {
  const files = await db.select().from(schema.secureFiles).orderBy(asc(schema.secureFiles.id));
  const { source } = await getDownloadPasswordStored();
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-bold text-[color:var(--color-wood)]">강사 자료</h1>
      <p className="text-sm text-[color:var(--color-ink-soft)] mt-1">
        강사 카드, 통장 사본, 신분증 사본을 업로드하고 관리합니다. 외부 페이지에서는 비밀번호로 보호됩니다.
      </p>
      <div className="mt-4">
        <DownloadPasswordForm initialSource={source} />
      </div>
      <div className="mt-6">
        <FilesManager
          files={files.map((f) => ({
            id: f.id,
            kind: f.kind,
            label: f.label,
            filename: f.filename,
            size: f.size,
            mimeType: f.mimeType,
            isPublic: f.isPublic,
          }))}
        />
      </div>
    </div>
  );
}
