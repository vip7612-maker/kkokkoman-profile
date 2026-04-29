import Link from "next/link";
import { Icon } from "@iconify/react";
import { db, schema } from "@/db/client";
import { desc } from "drizzle-orm";
import { formatDateKo } from "@/lib/utils";
import { CaseRowActions } from "@/components/admin/case-row-actions";

export const dynamic = "force-dynamic";

export default async function AdminCasesPage() {
  const items = await db
    .select()
    .from(schema.cases)
    .orderBy(desc(schema.cases.lecturedAt), desc(schema.cases.createdAt));

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[color:var(--color-wood)]">강의 사례</h1>
          <p className="text-sm text-[color:var(--color-ink-soft)] mt-1">현장의 따뜻한 기록을 작성·관리합니다.</p>
        </div>
        <Link href="/admin/cases/new" className="btn btn-primary text-sm">
          <Icon icon="mdi:plus" /> 새 글 작성
        </Link>
      </div>

      <div className="mt-6 card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--color-bg-alt)] text-[color:var(--color-ink-soft)] text-xs">
            <tr>
              <th className="text-left px-4 py-3">제목</th>
              <th className="text-left px-4 py-3">기관</th>
              <th className="text-left px-4 py-3">강의일</th>
              <th className="text-left px-4 py-3">공개</th>
              <th className="text-right px-4 py-3">관리</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={5} className="text-center py-12 text-[color:var(--color-ink-soft)]">아직 등록된 사례가 없습니다.</td></tr>
            )}
            {items.map((c) => (
              <tr key={c.id} className="border-t border-[color:var(--color-line)]">
                <td className="px-4 py-3">
                  <Link href={`/admin/cases/${c.id}`} className="font-medium text-[color:var(--color-wood)] hover:underline">
                    {c.title}
                  </Link>
                  <div className="text-xs text-[color:var(--color-ink-soft)] line-clamp-1">{c.summary}</div>
                </td>
                <td className="px-4 py-3 text-[color:var(--color-ink-soft)]">{c.orgName ?? "-"}</td>
                <td className="px-4 py-3 text-[color:var(--color-ink-soft)]">{c.lecturedAt ? formatDateKo(c.lecturedAt) : "-"}</td>
                <td className="px-4 py-3">
                  {c.published ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">공개</span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">비공개</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <CaseRowActions id={c.id} slug={c.slug} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
