import Link from "next/link";
import { Icon } from "@iconify/react";
import { profile } from "@/lib/profile";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-[color:var(--color-line)] bg-[color:var(--color-bg-alt)]">
      <div className="mx-auto max-w-6xl px-5 py-10 grid gap-8 md:grid-cols-3 text-sm">
        <div>
          <div className="font-display text-lg font-bold text-[color:var(--color-wood)]">
            {profile.stageName}
          </div>
          <p className="mt-2 text-[color:var(--color-ink-soft)] leading-relaxed">
            {profile.tagline} — 팬플룻 연주자 {profile.name}의 강의·연주 프로필
            사이트.
          </p>
        </div>
        <div>
          <div className="font-semibold mb-2 text-[color:var(--color-wood)]">
            바로가기
          </div>
          <ul className="space-y-1.5 text-[color:var(--color-ink-soft)]">
            <li><Link href="/profile" className="hover:text-[color:var(--color-wood)]">프로필</Link></li>
            <li><Link href="/cases" className="hover:text-[color:var(--color-wood)]">강의 사례</Link></li>
            <li><Link href="/downloads" className="hover:text-[color:var(--color-wood)]">강사 자료</Link></li>
            <li><Link href="/request" className="hover:text-[color:var(--color-wood)]">강의 요청</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2 text-[color:var(--color-wood)]">
            문의
          </div>
          <ul className="space-y-1.5 text-[color:var(--color-ink-soft)]">
            <li className="flex items-center gap-2"><Icon icon="mdi:email-outline" />jaru1125@naver.com</li>
            <li className="flex items-center gap-2"><Icon icon="mdi:map-marker-outline" />강원도 원주 외 전국 출강</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[color:var(--color-line)] py-4 text-center text-xs text-[color:var(--color-ink-soft)]">
        © {new Date().getFullYear()} {profile.name} · {profile.stageName}. All rights reserved.
      </div>
    </footer>
  );
}
