import { Icon } from "@iconify/react";
import { db, schema } from "@/db/client";
import { asc } from "drizzle-orm";
import { DownloadGate } from "@/components/download-gate";

export const dynamic = "force-dynamic";
export const metadata = { title: "강사 자료 · 꼬꼬맨" };

const KIND_LABELS: Record<string, { label: string; icon: string }> = {
  card: { label: "강사 카드", icon: "mdi:account-box-outline" },
  bank: { label: "통장 사본", icon: "mdi:bank-outline" },
  id: { label: "신분증 사본", icon: "mdi:card-account-details-outline" },
};

export default async function DownloadsPage() {
  const files = await db
    .select()
    .from(schema.secureFiles)
    .orderBy(asc(schema.secureFiles.id));

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 md:py-20">
      <span className="chip"><Icon icon="mdi:file-document-outline" /> 강사 자료실</span>
      <h1 className="font-display mt-4 text-4xl md:text-5xl font-bold text-[color:var(--color-wood)]">
        강사 자료 다운로드
      </h1>
      <p className="mt-4 text-[color:var(--color-ink-soft)] leading-relaxed">
        강사 카드, 통장 사본, 신분증 사본은 비밀번호로 보호되어 있습니다. 강사가
        직접 안내드린 비밀번호를 입력하신 후 5분 이내에 다운로드해 주세요.
      </p>

      <div className="mt-8 grid gap-3">
        {files.length === 0 ? (
          <div className="card p-8 text-center text-[color:var(--color-ink-soft)]">
            <Icon icon="mdi:file-question-outline" className="mx-auto text-3xl text-[color:var(--color-beige-deep)]" />
            <p className="mt-2 text-sm">관리자가 자료를 업로드하면 이곳에 표시됩니다.</p>
          </div>
        ) : (
          files.map((f) => {
            const meta = KIND_LABELS[f.kind] ?? { label: f.label, icon: "mdi:file-outline" };
            return (
              <div key={f.id} className="card p-4 flex items-center gap-4">
                <div className="grid place-items-center size-12 rounded-2xl bg-[color:var(--color-cream)] text-[color:var(--color-wood)]">
                  <Icon icon={meta.icon} className="text-2xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[color:var(--color-wood)]">{f.label}</div>
                  <div className="text-xs text-[color:var(--color-ink-soft)] truncate">
                    {f.filename} · {(f.size / 1024).toFixed(0)} KB
                  </div>
                </div>
                <DownloadGate fileId={f.id} filename={f.filename} />
              </div>
            );
          })
        )}
      </div>

      <div className="mt-8 p-4 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-cream)]/60 text-xs text-[color:var(--color-ink-soft)] leading-relaxed">
        <div className="flex items-start gap-2">
          <Icon icon="mdi:shield-lock-outline" className="text-base mt-0.5 text-[color:var(--color-wood)]" />
          <div>
            본 자료는 강의·계약 진행을 위한 강사 본인 확인용 자료입니다. 개인정보 보호를 위해
            제3자에게 공유하지 마시고, 다운로드 후 즉시 삭제 또는 안전한 장소에 보관해 주세요.
          </div>
        </div>
      </div>
    </div>
  );
}
