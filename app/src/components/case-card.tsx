import Link from "next/link";
import { Icon } from "@iconify/react";
import { formatDateKo } from "@/lib/utils";

type CaseItem = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  coverImage: string | null;
  orgName: string | null;
  lecturedAt: string | null;
};

export function CaseCard({ item }: { item: CaseItem }) {
  return (
    <Link
      href={`/cases/${item.slug}`}
      className="group card overflow-hidden flex flex-col hover:shadow-[var(--shadow-pop)] transition"
    >
      <div className="aspect-[16/10] bg-[color:var(--color-bg-alt)] relative overflow-hidden">
        {item.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.coverImage}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[color:var(--color-cream)] to-[color:var(--color-beige)]/50">
            <Icon icon="mdi:music-note" className="text-5xl text-[color:var(--color-wood)]/60" />
          </div>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-xs text-[color:var(--color-ink-soft)]">
          {item.orgName && (
            <span className="inline-flex items-center gap-1">
              <Icon icon="mdi:office-building-outline" />{item.orgName}
            </span>
          )}
          {item.lecturedAt && (
            <>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Icon icon="mdi:calendar-blank-outline" />{formatDateKo(item.lecturedAt)}
              </span>
            </>
          )}
        </div>
        <h3 className="mt-2 font-display text-lg font-bold text-[color:var(--color-wood)] line-clamp-2 group-hover:underline underline-offset-4">
          {item.title}
        </h3>
        <p className="mt-1 text-sm text-[color:var(--color-ink-soft)] line-clamp-2">{item.summary}</p>
        <div className="mt-4 inline-flex items-center gap-1 text-sm text-[color:var(--color-leaf-deep)] font-medium">
          자세히 보기 <Icon icon="mdi:arrow-right" className="group-hover:translate-x-1 transition" />
        </div>
      </div>
    </Link>
  );
}
