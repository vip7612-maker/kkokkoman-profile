import { Icon } from "@iconify/react";
import { db, schema } from "@/db/client";
import { desc, eq } from "drizzle-orm";
import { CaseCard } from "@/components/case-card";

export const dynamic = "force-dynamic";
export const metadata = { title: "강의 사례 · 꼬꼬맨" };

export default async function CasesPage() {
  const items = await db
    .select()
    .from(schema.cases)
    .where(eq(schema.cases.published, true))
    .orderBy(desc(schema.cases.lecturedAt), desc(schema.cases.createdAt));

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:py-20">
      <span className="chip"><Icon icon="mdi:bookmark-music-outline" /> 강의 사례</span>
      <h1 className="font-display mt-4 text-4xl md:text-5xl font-bold text-[color:var(--color-wood)]">
        현장의 따뜻한 기록
      </h1>
      <p className="mt-3 text-[color:var(--color-ink-soft)]">
        꼬꼬맨이 다녀온 강의·공연 현장의 사진과 후기를 모았습니다.
      </p>

      {items.length === 0 ? (
        <div className="card p-16 text-center mt-10">
          <Icon icon="mdi:music-note-eighth" className="mx-auto text-4xl text-[color:var(--color-beige-deep)]" />
          <p className="mt-3 text-[color:var(--color-ink-soft)]">
            첫 사례가 곧 등록됩니다.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((c) => (
            <CaseCard key={c.id} item={c} />
          ))}
        </div>
      )}
    </div>
  );
}
