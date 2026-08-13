import Link from "next/link";
import { Icon } from "@iconify/react";
import { db, schema } from "@/db/client";
import { desc, eq } from "drizzle-orm";
import { profile } from "@/lib/profile";
import { CaseCard } from "@/components/case-card";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const recentCases = await db
    .select()
    .from(schema.cases)
    .where(eq(schema.cases.published, true))
    .orderBy(desc(schema.cases.lecturedAt), desc(schema.cases.createdAt))
    .limit(6);

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-8 md:pt-20 pb-12 md:pb-16">
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-8 md:gap-10 items-center">
          <div>
            <span className="chip">
              <Icon icon="mdi:music-note" /> 팬플룻 연주자
            </span>
            <h1 className="font-display mt-4 md:mt-5 text-[2rem] sm:text-4xl md:text-6xl font-bold text-[color:var(--color-wood)] leading-[1.15]">
              음악으로 마음을<br />
              잇다, <span className="relative inline-block">
                <span className="relative z-10">{profile.stageName}</span>
                <span className="absolute inset-x-0 bottom-1 h-3 bg-[color:var(--color-beige)]/55 rounded-sm -z-0" />
              </span>
            </h1>
            <p className="mt-5 text-[color:var(--color-ink-soft)] text-base md:text-lg leading-relaxed max-w-xl">
              전국 팬플룻 대회 금상 30회 수상의 연주자 <b>{profile.name}</b>입니다.
              학교, 기업, 의료·교정 시설 등 어디든 찾아가 음악으로 마음을 어루만지는
              강의와 공연을 전합니다.
            </p>
            <div className="mt-6 md:mt-8 flex flex-wrap gap-2.5 md:gap-3">
              <Link href="/request" className="btn btn-primary text-sm md:text-base">
                <Icon icon="mdi:calendar-check-outline" /> 강의 요청하기
              </Link>
              <Link href="/profile" className="btn btn-ghost text-sm md:text-base">
                <Icon icon="mdi:account-music-outline" /> 강사 프로필
              </Link>
              <Link href="/cases" className="btn btn-ghost text-sm md:text-base">
                <Icon icon="mdi:notebook-multiple" /> 강의 사례
              </Link>
            </div>
            <div className="mt-8 md:mt-10 grid grid-cols-3 max-w-md gap-2 md:gap-3 text-center">
              <Stat icon="mdi:trophy-outline" value="30회" label="전국대회 금상" />
              <Stat icon="mdi:school-outline" value="9+" label="활동 기관" />
              <Stat icon="mdi:certificate-outline" value="4종" label="전문 자격" />
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-[28px] overflow-hidden border border-[color:var(--color-line)] shadow-[var(--shadow-pop)] bg-[color:var(--color-cream)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/uploads/profile-hero.jpg"
                alt="팬플룻을 들고 있는 김춘흥 (꼬꼬맨)"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden md:block absolute -left-6 -bottom-6 card p-4 w-48 rotate-[-4deg] bg-white">
              <div className="flex items-center gap-2 text-[color:var(--color-wood)]">
                <Icon icon="mdi:medal-outline" className="text-xl" />
                <span className="font-semibold text-sm">국회의원 표창</span>
              </div>
              <p className="mt-1 text-xs text-[color:var(--color-ink-soft)]">
                대한민국 자원봉사 우수상 외 다수
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5">
        <div className="grid md:grid-cols-3 gap-5">
          <BandCard
            icon="mdi:account-tie-voice-outline"
            title="강의·강연"
            text="음악심리, 진로코칭, 장애인 인식 개선 등 강사 활동"
          />
          <BandCard
            icon="mdi:music-note-outline"
            title="연주·공연"
            text="팬플룻 솔로/콜라보 연주, 지역행사·기관 행사 출연"
          />
          <BandCard
            icon="mdi:hand-heart-outline"
            title="재능 나눔"
            text="교정시설·정신병원·요양기관 정기 자원봉사"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 mt-24">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <span className="chip">
              <Icon icon="mdi:bookmark-music-outline" /> 강의 사례
            </span>
            <h2 className="font-display mt-3 text-3xl md:text-4xl font-bold text-[color:var(--color-wood)]">
              현장의 따뜻한 기록
            </h2>
            <p className="mt-2 text-[color:var(--color-ink-soft)]">
              꼬꼬맨이 다녀온 강의·공연 현장을 사진과 글로 남깁니다.
            </p>
          </div>
          <Link href="/cases" className="btn btn-ghost text-sm">
            전체 보기 <Icon icon="mdi:arrow-right" />
          </Link>
        </div>
        {recentCases.length === 0 ? (
          <EmptyCases />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentCases.map((c) => (
              <CaseCard key={c.id} item={c} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-5 mt-16 md:mt-24">
        <div
          className="rounded-[22px] p-7 md:p-12 grid md:grid-cols-[1.5fr_1fr] gap-6 md:gap-8 items-center shadow-[var(--shadow-pop)]"
          style={{ backgroundColor: "var(--color-wood)", color: "#FBF6EA" }}
        >
          <div>
            <h3 className="font-display text-2xl md:text-4xl font-bold leading-tight" style={{ color: "#FFF6E5" }}>
              꼬꼬맨을 강사로 모셔보세요
            </h3>
            <p className="mt-3 leading-relaxed text-[15px] md:text-base" style={{ color: "rgba(255,246,229,0.88)" }}>
              학교, 기업, 단체, 행사 — 어디든 음악과 이야기를 들고 찾아갑니다.
              희망 일정을 자유롭게 입력해 주세요. 빠르게 회신드립니다.
            </p>
          </div>
          <div className="flex md:justify-end gap-3 flex-wrap">
            <Link href="/request" className="btn btn-leaf">
              <Icon icon="mdi:send-outline" /> 강의 요청
            </Link>
            <Link
              href="/downloads"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-semibold border transition"
              style={{
                color: "#FFF6E5",
                borderColor: "rgba(255,246,229,0.45)",
                backgroundColor: "rgba(255,255,255,0.04)",
              }}
            >
              <Icon icon="mdi:file-document-outline" /> 강사 자료
            </Link>
          </div>
        </div>
      </section>

      <div className="h-24" />
    </>
  );
}

function Stat({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="card px-2 py-3 md:px-3 md:py-4">
      <Icon icon={icon} className="mx-auto text-xl md:text-2xl text-[color:var(--color-beige-deep)]" />
      <div className="mt-1 font-display text-base md:text-xl font-bold text-[color:var(--color-wood)]">
        {value}
      </div>
      <div className="text-[10px] md:text-[11px] text-[color:var(--color-ink-soft)] leading-tight">{label}</div>
    </div>
  );
}

function BandCard({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="card p-6 hover:shadow-[var(--shadow-pop)] transition">
      <Icon icon={icon} className="text-3xl text-[color:var(--color-leaf-deep)]" />
      <h3 className="mt-3 font-bold text-[color:var(--color-wood)] text-lg">{title}</h3>
      <p className="mt-1 text-sm text-[color:var(--color-ink-soft)] leading-relaxed">{text}</p>
    </div>
  );
}

function EmptyCases() {
  return (
    <div className="card p-10 text-center">
      <Icon
        icon="mdi:music-note-eighth"
        className="mx-auto text-4xl text-[color:var(--color-beige-deep)]"
      />
      <p className="mt-2 text-[color:var(--color-ink-soft)]">
        곧 첫 강의 사례가 등록됩니다.
      </p>
    </div>
  );
}
