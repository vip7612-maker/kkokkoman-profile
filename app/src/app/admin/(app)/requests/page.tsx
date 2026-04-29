import { db, schema } from "@/db/client";
import { desc, eq } from "drizzle-orm";
import { formatDateKo } from "@/lib/utils";
import { RequestStatusSelect } from "@/components/admin/request-status-select";

export const dynamic = "force-dynamic";

export default async function AdminRequestsPage() {
  const requests = await db
    .select()
    .from(schema.lectureRequests)
    .orderBy(desc(schema.lectureRequests.createdAt));

  const allDates = await db.select().from(schema.lectureRequestDates);
  const datesByReq = new Map<number, typeof allDates>();
  for (const d of allDates) {
    if (!datesByReq.has(d.requestId)) datesByReq.set(d.requestId, []);
    datesByReq.get(d.requestId)!.push(d);
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-[color:var(--color-wood)]">강의 요청</h1>
      <p className="text-sm text-[color:var(--color-ink-soft)] mt-1">접수된 요청을 확인하고 상태를 관리합니다.</p>
      <div className="mt-6 grid gap-4">
        {requests.length === 0 ? (
          <div className="card p-8 text-center text-[color:var(--color-ink-soft)]">아직 요청이 없습니다.</div>
        ) : (
          requests.map((r) => (
            <div key={r.id} className="card p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="text-xs text-[color:var(--color-ink-soft)]">{formatDateKo(r.createdAt)}</div>
                  <h3 className="font-display text-lg font-bold text-[color:var(--color-wood)] mt-1">
                    {r.organization}
                  </h3>
                  <div className="text-sm text-[color:var(--color-ink-soft)]">
                    {r.contactName} · {r.phone} · {r.email}
                  </div>
                </div>
                <RequestStatusSelect id={r.id} value={r.status} />
              </div>
              <div className="mt-3 grid sm:grid-cols-3 gap-2 text-sm">
                <div><span className="text-[color:var(--color-ink-soft)]">대상</span> {r.audience}</div>
                <div><span className="text-[color:var(--color-ink-soft)]">인원</span> {r.headcount}명</div>
                {r.budget && <div><span className="text-[color:var(--color-ink-soft)]">예산</span> {r.budget}</div>}
              </div>
              {r.message && (
                <p className="mt-3 text-sm whitespace-pre-wrap p-3 rounded-lg bg-[color:var(--color-cream)] border border-[color:var(--color-line)]">
                  {r.message}
                </p>
              )}
              <div className="mt-3">
                <div className="text-xs font-semibold text-[color:var(--color-wood)] mb-1">희망 일정</div>
                <ul className="text-sm grid gap-1">
                  {(datesByReq.get(r.id) ?? []).map((d) => (
                    <li key={d.id} className="flex flex-wrap gap-2 items-center text-[color:var(--color-ink-soft)]">
                      <span className="font-medium text-[color:var(--color-ink)]">{d.date}</span>
                      {(d.timeFrom || d.timeTo) && <span>{d.timeFrom ?? ""} ~ {d.timeTo ?? ""}</span>}
                      {d.location && <span>· {d.location}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
