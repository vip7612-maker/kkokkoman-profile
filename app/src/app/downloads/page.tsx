import { Icon } from "@iconify/react";
import { db, schema } from "@/db/client";
import { asc, eq } from "drizzle-orm";
import { DownloadGate } from "@/components/download-gate";

export const dynamic = "force-dynamic";
export const metadata = { title: "강사 자료 · 꼬꼬맨" };

const KIND_LABELS: Record<string, { label: string; icon: string }> = {
  card: { label: "강사 카드", icon: "mdi:account-box-outline" },
  bank: { label: "통장 사본", icon: "mdi:bank-outline" },
  id: { label: "신분증 사본", icon: "mdi:card-account-details-outline" },
  proposal: { label: "강의 제안서", icon: "mdi:file-document-multiple-outline" },
};

export default async function DownloadsPage() {
  const allFiles = await db
    .select()
    .from(schema.secureFiles)
    .orderBy(asc(schema.secureFiles.id));

  const proposals = allFiles.filter((f) => f.isPublic);
  const secureFiles = allFiles.filter((f) => !f.isPublic);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 md:py-20">
      <span className="chip">
        <Icon icon="mdi:file-document-outline" /> 강사 자료실
      </span>
      <h1 className="font-display mt-4 text-3xl md:text-5xl font-bold text-[color:var(--color-wood)]">
        강사 자료 다운로드
      </h1>
      <p className="mt-4 text-[color:var(--color-ink-soft)] leading-relaxed text-sm md:text-base">
        강의 검토에 필요한 제안서는 누구나 바로 받으실 수 있고, 강사 카드·통장 사본·신분증 사본은
        비밀번호 인증 후 24시간 이내 다운로드 가능합니다.
      </p>

      {/* ── 강의 제안서 (공개) ── */}
      <section className="mt-8">
        <h2 className="flex items-center gap-2 font-display text-lg md:text-xl font-bold text-[color:var(--color-wood)]">
          <Icon icon="mdi:file-document-multiple-outline" className="text-[color:var(--color-leaf-deep)]" />
          강의 제안서
        </h2>
        <p className="mt-1 text-xs md:text-sm text-[color:var(--color-ink-soft)]">
          강의 형식, 콘텐츠, 운영 안내가 정리되어 있습니다. 비밀번호 없이 받으실 수 있어요.
        </p>
        <div className="mt-3 grid gap-3">
          {proposals.length === 0 ? (
            <div className="card p-6 md:p-8 text-center text-sm text-[color:var(--color-ink-soft)]">
              <Icon
                icon="mdi:file-question-outline"
                className="mx-auto text-3xl text-[color:var(--color-beige-deep)]"
              />
              <p className="mt-2">강의 제안서가 곧 등록됩니다.</p>
            </div>
          ) : (
            proposals.map((f) => (
              <div key={f.id} className="card p-4 flex items-center gap-3 md:gap-4">
                <div className="grid place-items-center size-11 md:size-12 rounded-2xl bg-[color:var(--color-leaf)]/15 text-[color:var(--color-leaf-deep)] shrink-0">
                  <Icon icon="mdi:file-document-multiple-outline" className="text-2xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[color:var(--color-wood)] text-sm md:text-base truncate">
                    {f.label}
                  </div>
                  <div className="text-[11px] md:text-xs text-[color:var(--color-ink-soft)] truncate">
                    {f.filename} · {(f.size / 1024).toFixed(0)} KB
                  </div>
                </div>
                <a
                  href={`/api/downloads/public/${f.id}`}
                  className="btn btn-leaf text-xs md:text-sm shrink-0"
                >
                  <Icon icon="mdi:download" /> <span className="hidden sm:inline">다운로드</span>
                </a>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ── 보호 자료 ── */}
      <section className="mt-10">
        <h2 className="flex items-center gap-2 font-display text-lg md:text-xl font-bold text-[color:var(--color-wood)]">
          <Icon icon="mdi:shield-lock-outline" className="text-[color:var(--color-beige-deep)]" />
          강사 본인 확인 자료
        </h2>
        <p className="mt-1 text-xs md:text-sm text-[color:var(--color-ink-soft)]">
          비밀번호로 보호되어 있습니다. 강사가 안내해드린 비밀번호를 입력해 주세요.
        </p>
        <div className="mt-3 grid gap-3">
          {secureFiles.length === 0 ? (
            <div className="card p-6 md:p-8 text-center text-sm text-[color:var(--color-ink-soft)]">
              <Icon
                icon="mdi:file-question-outline"
                className="mx-auto text-3xl text-[color:var(--color-beige-deep)]"
              />
              <p className="mt-2">관리자가 자료를 업로드하면 이곳에 표시됩니다.</p>
            </div>
          ) : (
            secureFiles.map((f) => {
              const meta = KIND_LABELS[f.kind] ?? { label: f.label, icon: "mdi:file-outline" };
              return (
                <div key={f.id} className="card p-4 flex items-center gap-3 md:gap-4">
                  <div className="grid place-items-center size-11 md:size-12 rounded-2xl bg-[color:var(--color-cream)] text-[color:var(--color-wood)] shrink-0">
                    <Icon icon={meta.icon} className="text-2xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[color:var(--color-wood)] text-sm md:text-base truncate">
                      {f.label}
                    </div>
                    <div className="text-[11px] md:text-xs text-[color:var(--color-ink-soft)] truncate">
                      {f.filename} · {(f.size / 1024).toFixed(0)} KB
                    </div>
                  </div>
                  <DownloadGate fileId={f.id} filename={f.filename} />
                </div>
              );
            })
          )}
        </div>
      </section>

      <div className="mt-8 p-4 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-cream)]/60 text-xs text-[color:var(--color-ink-soft)] leading-relaxed">
        <div className="flex items-start gap-2">
          <Icon
            icon="mdi:shield-lock-outline"
            className="text-base mt-0.5 text-[color:var(--color-wood)]"
          />
          <div>
            본인 확인 자료는 강의·계약 진행을 위한 강사 본인 확인용입니다. 개인정보 보호를 위해
            제3자에게 공유하지 마시고, 다운로드 후 즉시 삭제하거나 안전한 장소에 보관해 주세요.
          </div>
        </div>
      </div>
    </div>
  );
}
