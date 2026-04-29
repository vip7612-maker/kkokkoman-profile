import { Icon } from "@iconify/react";
import { RequestForm } from "@/components/request-form";

export const metadata = { title: "강의 요청 · 꼬꼬맨" };

export default function RequestPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 md:py-20">
      <span className="chip"><Icon icon="mdi:calendar-check-outline" /> 강의 요청</span>
      <h1 className="font-display mt-4 text-4xl md:text-5xl font-bold text-[color:var(--color-wood)]">
        꼬꼬맨에게 강의를<br className="hidden sm:block" /> 요청해 주세요
      </h1>
      <p className="mt-4 text-[color:var(--color-ink-soft)] leading-relaxed">
        희망 일정은 여러 개 입력하실 수 있습니다. 접수 즉시 강사 이메일로 알림이
        전송되며, 빠른 시일 내 회신드립니다.
      </p>
      <div className="mt-8 card p-6 md:p-8">
        <RequestForm />
      </div>
      <div className="mt-6 grid sm:grid-cols-3 gap-3 text-sm text-[color:var(--color-ink-soft)]">
        <Tip icon="mdi:lock-outline" text="입력 정보는 강사 이메일로만 전송됩니다." />
        <Tip icon="mdi:clock-outline" text="평균 1~2일 내 회신을 드립니다." />
        <Tip icon="mdi:phone-outline" text="긴급 문의는 jaru1125@naver.com으로 보내주세요." />
      </div>
    </div>
  );
}

function Tip({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-start gap-2 p-3 rounded-xl bg-[color:var(--color-cream)] border border-[color:var(--color-line)]">
      <Icon icon={icon} className="mt-0.5 text-[color:var(--color-beige-deep)]" />
      <span>{text}</span>
    </div>
  );
}
