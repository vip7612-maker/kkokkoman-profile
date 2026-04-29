import Link from "next/link";
import { Icon } from "@iconify/react";
import { profile } from "@/lib/profile";

const nav = [
  { href: "/profile", label: "프로필" },
  { href: "/cases", label: "강의 사례" },
  { href: "/downloads", label: "강사 자료" },
  { href: "/request", label: "강의 요청" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-[color:var(--color-bg)]/85 border-b border-[color:var(--color-line)]">
      <div className="mx-auto max-w-6xl px-5 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="grid place-items-center size-9 rounded-full bg-[color:var(--color-wood)] text-[color:var(--color-cream)] shadow-sm">
            <Icon icon="game-icons:pan-flute" className="text-lg" />
          </span>
          <span className="font-display text-[16px] font-bold text-[color:var(--color-wood)] leading-tight">
            {profile.stageName}
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="px-3 py-2 rounded-full text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-wood)] hover:bg-[color:var(--color-cream)] transition"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <Link href="/request" className="btn btn-primary text-sm hidden sm:inline-flex">
          <Icon icon="mdi:send-outline" /> 강의 요청
        </Link>
        <Link
          href="/request"
          className="sm:hidden grid place-items-center size-10 rounded-full bg-[color:var(--color-wood)] text-white"
          aria-label="강의 요청"
        >
          <Icon icon="mdi:send-outline" />
        </Link>
      </div>
      <nav className="md:hidden border-t border-[color:var(--color-line)] bg-[color:var(--color-bg)]/90 overflow-x-auto">
        <ul className="flex gap-1 px-3 py-2 text-sm whitespace-nowrap">
          {nav.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                className="px-3 py-1.5 rounded-full text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-wood)] hover:bg-[color:var(--color-cream)]"
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
