import { Icon } from "@iconify/react";
import Link from "next/link";
import { db, schema } from "@/db/client";
import { desc, sql } from "drizzle-orm";
import { formatDateKo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [caseCount] = await db
    .select({ n: sql<number>`count(*)` })
    .from(schema.cases);
  const [reqCount] = await db
    .select({ n: sql<number>`count(*)` })
    .from(schema.lectureRequests);
  const [fileCount] = await db
    .select({ n: sql<number>`count(*)` })
    .from(schema.secureFiles);

  const recentRequests = await db
    .select()
    .from(schema.lectureRequests)
    .orderBy(desc(schema.lectureRequests.createdAt))
    .limit(5);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-[color:var(--color-wood)]">대시보드</h1>
      <p className="text-sm text-[color:var(--color-ink-soft)] mt-1">사이트 운영 현황 한눈에 보기</p>

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        <Stat icon="mdi:notebook-multiple" label="강의 사례" value={caseCount.n} href="/admin/cases" />
        <Stat icon="mdi:inbox-outline" label="강의 요청" value={reqCount.n} href="/admin/requests" />
        <Stat icon="mdi:file-lock-outline" label="강사 자료" value={fileCount.n} href="/admin/files" />
      </div>

      <div className="mt-10 card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-[color:var(--color-wood)]">최근 강의 요청</h2>
          <Link href="/admin/requests" className="text-sm text-[color:var(--color-leaf-deep)] hover:underline">
            전체 보기
          </Link>
        </div>
        {recentRequests.length === 0 ? (
          <p className="text-sm text-[color:var(--color-ink-soft)] mt-3">아직 요청이 없습니다.</p>
        ) : (
          <div className="mt-4 overflow-x-auto -mx-2 md:mx-0">
          <table className="w-full text-sm min-w-[560px]">
            <thead className="text-left text-xs text-[color:var(--color-ink-soft)]">
              <tr><th className="py-2">기관</th><th>담당자</th><th>대상/인원</th><th>상태</th><th>일시</th></tr>
            </thead>
            <tbody>
              {recentRequests.map((r) => (
                <tr key={r.id} className="border-t border-[color:var(--color-line)]">
                  <td className="py-2 font-medium">{r.organization}</td>
                  <td>{r.contactName}</td>
                  <td>{r.audience} / {r.headcount}명</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td className="text-[color:var(--color-ink-soft)]">{formatDateKo(r.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ icon, label, value, href }: { icon: string; label: string; value: number; href: string }) {
  return (
    <Link href={href} className="card p-5 flex items-center gap-4 hover:shadow-[var(--shadow-pop)] transition">
      <div className="grid place-items-center size-12 rounded-2xl bg-[color:var(--color-cream)] text-[color:var(--color-wood)]">
        <Icon icon={icon} className="text-2xl" />
      </div>
      <div>
        <div className="text-xs text-[color:var(--color-ink-soft)]">{label}</div>
        <div className="font-display text-2xl font-bold text-[color:var(--color-wood)]">{value}</div>
      </div>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { c: string; t: string }> = {
    new: { c: "bg-amber-100 text-amber-800", t: "새 요청" },
    contacted: { c: "bg-blue-100 text-blue-800", t: "연락중" },
    confirmed: { c: "bg-emerald-100 text-emerald-800", t: "확정" },
    done: { c: "bg-slate-200 text-slate-700", t: "완료" },
    canceled: { c: "bg-rose-100 text-rose-800", t: "취소" },
  };
  const s = map[status] ?? map.new;
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.c}`}>{s.t}</span>;
}
