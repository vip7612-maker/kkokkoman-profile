"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";

type DateRow = { date: string; timeFrom: string; timeTo: string; location: string };

const emptyRow: DateRow = { date: "", timeFrom: "", timeTo: "", location: "" };

export function RequestForm() {
  const [dates, setDates] = useState<DateRow[]>([{ ...emptyRow }]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addRow = () => setDates((d) => [...d, { ...emptyRow }]);
  const removeRow = (i: number) =>
    setDates((d) => (d.length === 1 ? d : d.filter((_, idx) => idx !== i)));
  const updateRow = (i: number, patch: Partial<DateRow>) =>
    setDates((d) => d.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      organization: String(form.get("organization") ?? ""),
      contactName: String(form.get("contactName") ?? ""),
      phone: String(form.get("phone") ?? ""),
      email: String(form.get("email") ?? ""),
      audience: String(form.get("audience") ?? ""),
      headcount: Number(form.get("headcount") ?? 0),
      budget: String(form.get("budget") ?? ""),
      message: String(form.get("message") ?? ""),
      dates: dates.filter((d) => d.date),
    };
    try {
      const res = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "전송 실패");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "전송 실패");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="grid place-items-center size-16 rounded-full bg-[color:var(--color-leaf)]/15 mx-auto">
          <Icon icon="mdi:check" className="text-3xl text-[color:var(--color-leaf-deep)]" />
        </div>
        <h2 className="font-display text-2xl font-bold text-[color:var(--color-wood)] mt-4">
          요청이 접수되었습니다
        </h2>
        <p className="text-[color:var(--color-ink-soft)] mt-2">
          강사가 확인 후 입력하신 이메일로 회신드립니다. 감사합니다 🎺
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="기관 / 단체" required>
          <input name="organization" required placeholder="예) 상지대학교 사회복지학과" className={inputCls} />
        </Field>
        <Field label="담당자" required>
          <input name="contactName" required placeholder="홍길동" className={inputCls} />
        </Field>
        <Field label="연락처" required>
          <input name="phone" required placeholder="010-0000-0000" className={inputCls} />
        </Field>
        <Field label="이메일" required>
          <input name="email" type="email" required placeholder="you@example.com" className={inputCls} />
        </Field>
        <Field label="대상" required>
          <input name="audience" required placeholder="예) 사회복지학과 1~2학년" className={inputCls} />
        </Field>
        <Field label="인원" required>
          <input name="headcount" type="number" min={1} required placeholder="예) 80" className={inputCls} />
        </Field>
        <Field label="예산 (선택)">
          <input name="budget" placeholder="예) 50만원" className={inputCls} />
        </Field>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-[color:var(--color-wood)] flex items-center gap-1.5">
            <Icon icon="mdi:calendar-multiple" />
            희망 일정 <span className="text-[color:var(--color-ink-soft)] font-normal">(여러 개 가능)</span>
          </label>
          <button
            type="button"
            onClick={addRow}
            className="text-sm inline-flex items-center gap-1 text-[color:var(--color-leaf-deep)] hover:underline"
          >
            <Icon icon="mdi:plus-circle-outline" /> 일정 추가
          </button>
        </div>
        <div className="mt-2 grid gap-2">
          {dates.map((row, i) => (
            <div
              key={i}
              className="p-3 rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-cream)]/40"
            >
              <div className="flex items-center justify-between mb-2 sm:hidden">
                <span className="text-xs font-semibold text-[color:var(--color-wood)]">
                  일정 {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  className="text-xs text-[color:var(--color-ink-soft)] inline-flex items-center gap-1 hover:text-rose-600 disabled:opacity-30"
                  aria-label="일정 삭제"
                  disabled={dates.length === 1}
                >
                  <Icon icon="mdi:trash-can-outline" /> 삭제
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_1fr_1.4fr_auto] gap-2 items-center">
                <input
                  type="date"
                  value={row.date}
                  onChange={(e) => updateRow(i, { date: e.target.value })}
                  className={`${inputCls} col-span-2 sm:col-span-1`}
                />
                <input
                  type="time"
                  value={row.timeFrom}
                  onChange={(e) => updateRow(i, { timeFrom: e.target.value })}
                  className={inputCls}
                  placeholder="시작"
                />
                <input
                  type="time"
                  value={row.timeTo}
                  onChange={(e) => updateRow(i, { timeTo: e.target.value })}
                  className={inputCls}
                  placeholder="종료"
                />
                <input
                  value={row.location}
                  onChange={(e) => updateRow(i, { location: e.target.value })}
                  className={`${inputCls} col-span-2 sm:col-span-1`}
                  placeholder="장소(선택)"
                />
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  className="hidden sm:grid place-items-center size-9 rounded-full text-[color:var(--color-ink-soft)] hover:bg-white"
                  aria-label="일정 삭제"
                  disabled={dates.length === 1}
                >
                  <Icon icon="mdi:trash-can-outline" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Field label="강의 주제 / 메시지">
        <textarea
          name="message"
          rows={5}
          className={`${inputCls} resize-y`}
          placeholder="원하시는 강의 주제, 분위기, 특이사항 등을 자유롭게 적어주세요."
        />
      </Field>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-2">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={submitting} className="btn btn-primary disabled:opacity-50">
          {submitting ? (
            <>
              <Icon icon="mdi:loading" className="animate-spin" /> 전송 중…
            </>
          ) : (
            <>
              <Icon icon="mdi:send-outline" /> 강의 요청 보내기
            </>
          )}
        </button>
        <span className="text-xs text-[color:var(--color-ink-soft)]">
          전송 시 강사 이메일로 즉시 알림이 갑니다.
        </span>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-lg border border-[color:var(--color-line)] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[color:var(--color-beige-deep)] focus:ring-2 focus:ring-[color:var(--color-beige)]/30";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[color:var(--color-wood)]">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
