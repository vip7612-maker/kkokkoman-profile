import { Icon } from "@iconify/react";
import Link from "next/link";
import { profile } from "@/lib/profile";

export const metadata = {
  title: `프로필 · ${profile.stageName}`,
};

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 md:py-20">
      <div className="grid md:grid-cols-[260px_1fr] gap-10 items-start">
        <aside className="md:sticky md:top-24">
          <div className="card overflow-hidden">
            <div className="aspect-square bg-gradient-to-br from-[color:var(--color-cream)] to-[color:var(--color-beige)]/50 grid place-items-center">
              <Icon icon="mdi:flute" className="text-7xl text-[color:var(--color-wood)]/70" />
            </div>
            <div className="p-5">
              <div className="text-xs text-[color:var(--color-ink-soft)]">예명</div>
              <div className="font-display text-xl font-bold text-[color:var(--color-wood)]">
                {profile.stageName}
              </div>
              <div className="mt-2 text-xs text-[color:var(--color-ink-soft)]">본명</div>
              <div className="font-semibold">{profile.name}</div>
              <div className="mt-2 text-xs text-[color:var(--color-ink-soft)]">분야</div>
              <div className="text-sm">{profile.role}</div>
              <Link href="/request" className="btn btn-primary w-full mt-5">
                <Icon icon="mdi:send-outline" /> 강의 요청
              </Link>
              <Link href="/downloads" className="btn btn-ghost w-full mt-2 text-sm">
                <Icon icon="mdi:file-document-outline" /> 강사 자료
              </Link>
            </div>
          </div>
        </aside>
        <div>
          <span className="chip"><Icon icon="mdi:account-music-outline" /> Profile</span>
          <h1 className="font-display mt-4 text-4xl md:text-5xl font-bold text-[color:var(--color-wood)]">
            {profile.tagline}
          </h1>
          <p className="mt-4 text-[color:var(--color-ink-soft)] leading-relaxed text-lg">
            {profile.intro}
          </p>

          <Section icon="mdi:school-outline" title="학력">
            <ul className="space-y-2">
              {profile.education.map((e) => (
                <li key={e} className="flex items-start gap-2">
                  <Icon icon="mdi:circle-medium" className="mt-1 text-[color:var(--color-beige-deep)]" />
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section icon="mdi:certificate-outline" title="자격사항">
            <ul className="grid sm:grid-cols-2 gap-2">
              {profile.certifications.map((e) => (
                <li
                  key={e}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[color:var(--color-cream)] border border-[color:var(--color-line)]"
                >
                  <Icon icon="mdi:check-decagram" className="text-[color:var(--color-leaf-deep)]" />
                  <span className="text-sm">{e}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section icon="mdi:trophy-outline" title="수상 경력">
            <ol className="space-y-3">
              {profile.awards.map((e, i) => (
                <li key={e} className="flex items-start gap-3">
                  <span className="grid place-items-center size-7 rounded-full bg-[color:var(--color-beige)] text-[color:var(--color-wood)] text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="pt-1">{e}</span>
                </li>
              ))}
            </ol>
          </Section>

          <Section icon="mdi:microphone-outline" title="강의 및 활동 경력">
            <div className="grid sm:grid-cols-2 gap-2">
              {profile.activities.map((e) => (
                <div
                  key={e}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[color:var(--color-line)] bg-white"
                >
                  <Icon icon="mdi:map-marker-outline" className="text-[color:var(--color-beige-deep)]" />
                  <span className="text-sm">{e}</span>
                </div>
              ))}
            </div>
          </Section>

          <div className="mt-12 card p-6 bg-[color:var(--color-bg-alt)] border-[color:var(--color-line)]">
            <h3 className="font-display text-xl font-bold text-[color:var(--color-wood)]">
              꼬꼬맨에게 강의를 요청하시나요?
            </h3>
            <p className="text-sm text-[color:var(--color-ink-soft)] mt-1">
              희망 일정·기관·대상을 입력하면 강사가 직접 회신드립니다.
            </p>
            <Link href="/request" className="btn btn-primary mt-4">
              <Icon icon="mdi:calendar-check-outline" /> 강의 요청 폼으로
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-[color:var(--color-wood)]">
        <Icon icon={icon} className="text-[color:var(--color-beige-deep)]" />
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
