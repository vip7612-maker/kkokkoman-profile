import { Icon } from "@iconify/react";
import { db, schema } from "@/db/client";
import { asc } from "drizzle-orm";
import { FilesManager } from "@/components/admin/files-manager";

export const dynamic = "force-dynamic";

export default async function AdminFilesPage() {
  const files = await db.select().from(schema.secureFiles).orderBy(asc(schema.secureFiles.id));
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-bold text-[color:var(--color-wood)]">강사 자료</h1>
      <p className="text-sm text-[color:var(--color-ink-soft)] mt-1">
        강사 카드, 통장 사본, 신분증 사본을 업로드하고 관리합니다. 외부 페이지에서는 비밀번호로 보호됩니다.
      </p>
      <div className="mt-4 p-4 rounded-xl bg-[color:var(--color-cream)] border border-[color:var(--color-line)] text-sm text-[color:var(--color-ink-soft)]">
        <div className="flex items-start gap-2">
          <Icon icon="mdi:information-outline" className="text-base mt-0.5 text-[color:var(--color-wood)]" />
          <div>
            다운로드 비밀번호는 환경변수 <code className="text-xs bg-white px-1 py-0.5 rounded">DOWNLOAD_PASSWORD</code>로 설정되어 있습니다. 변경하려면 .env.local 또는 배포 환경에서 값을 수정하세요.
          </div>
        </div>
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
