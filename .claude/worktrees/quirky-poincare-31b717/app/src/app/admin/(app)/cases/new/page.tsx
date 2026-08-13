import { CaseEditor } from "@/components/admin/case-editor";

export const metadata = { title: "새 강의 사례 · 어드민" };

export default function NewCasePage() {
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-bold text-[color:var(--color-wood)]">새 강의 사례</h1>
      <p className="text-sm text-[color:var(--color-ink-soft)] mt-1">제목, 요약, 본문(마크다운)을 입력해 주세요.</p>
      <div className="mt-6">
        <CaseEditor mode="create" />
      </div>
    </div>
  );
}
