import { notFound } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { db, schema } from "@/db/client";
import { and, asc, eq } from "drizzle-orm";
import { formatDateKo } from "@/lib/utils";
import { renderMarkdown } from "@/lib/markdown";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [item] = await db
    .select()
    .from(schema.cases)
    .where(eq(schema.cases.slug, slug))
    .limit(1);
  if (!item) return { title: "강의 사례" };
  return { title: `${item.title} · 강의 사례`, description: item.summary };
}

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [item] = await db
    .select()
    .from(schema.cases)
    .where(and(eq(schema.cases.slug, slug), eq(schema.cases.published, true)))
    .limit(1);

  if (!item) notFound();

  const images = await db
    .select()
    .from(schema.caseImages)
    .where(eq(schema.caseImages.caseId, item.id))
    .orderBy(asc(schema.caseImages.sortOrder));

  return (
    <article className="mx-auto max-w-3xl px-5 py-12 md:py-20">
      <Link href="/cases" className="text-sm text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-wood)] inline-flex items-center gap-1">
        <Icon icon="mdi:arrow-left" /> 강의 사례 목록
      </Link>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-[color:var(--color-ink-soft)]">
        {item.orgName && <span className="chip"><Icon icon="mdi:office-building-outline" />{item.orgName}</span>}
        {item.lecturedAt && <span className="chip"><Icon icon="mdi:calendar-blank-outline" />{formatDateKo(item.lecturedAt)}</span>}
      </div>
      <h1 className="font-display mt-3 text-3xl md:text-5xl font-bold text-[color:var(--color-wood)] leading-tight">
        {item.title}
      </h1>
      <p className="mt-4 text-lg text-[color:var(--color-ink-soft)] leading-relaxed">
        {item.summary}
      </p>
      {item.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.coverImage}
          alt={item.title}
          className="mt-8 w-full rounded-2xl border border-[color:var(--color-line)]"
        />
      )}
      <div
        className="prose-content mt-8"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(item.bodyMd) }}
      />
      {images.length > 0 && (
        <div className="mt-10 grid sm:grid-cols-2 gap-3">
          {images.map((img) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={img.id}
              src={img.url}
              alt={img.caption ?? ""}
              className="w-full rounded-xl border border-[color:var(--color-line)]"
            />
          ))}
        </div>
      )}

      <div className="mt-12 card p-6 bg-[color:var(--color-bg-alt)]">
        <h3 className="font-display text-xl font-bold text-[color:var(--color-wood)]">
          이런 강의를 함께하고 싶다면
        </h3>
        <p className="text-sm text-[color:var(--color-ink-soft)] mt-1">
          희망 일정과 대상을 알려주시면 맞춤형으로 준비해드립니다.
        </p>
        <Link href="/request" className="btn btn-primary mt-3">
          <Icon icon="mdi:send-outline" /> 강의 요청하기
        </Link>
      </div>
    </article>
  );
}
