"use client";
import { Icon } from "@iconify/react";
import { useState } from "react";

type Source = "db" | "env";

export function DownloadPasswordForm({ initialSource }: { initialSource: Source }) {
  const [source, setSource] = useState<Source>(initialSource);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (pw.length < 4) {
      setMsg({ kind: "err", text: "비밀번호는 최소 4자 이상이어야 합니다." });
      return;
    }
    if (pw !== pw2) {
      setMsg({ kind: "err", text: "두 입력이 일치하지 않습니다." });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/settings/download-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "변경 실패");
      setSource("db");
      setPw("");
      setPw2("");
      setMsg({ kind: "ok", text: "다운로드 비밀번호가 변경되었습니다." });
    } catch (e) {
      setMsg({ kind: "err", text: e instanceof Error ? e.message : "오류" });
    } finally {
      setBusy(false);
    }
  }

  async function reset() {
    if (!confirm("DB에 저장된 비밀번호를 삭제하고 환경변수(.env) 값으로 되돌립니다. 계속하시겠습니까?")) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/settings/download-password", { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "초기화 실패");
      setSource("env");
      setMsg({ kind: "ok", text: "환경변수 값으로 초기화되었습니다." });
    } catch (e) {
      setMsg({ kind: "err", text: e instanceof Error ? e.message : "오류" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card p-5">
      <div className="flex items-start gap-2 text-[color:var(--color-wood)]">
        <Icon icon="mdi:shield-key-outline" className="text-xl mt-0.5" />
        <div>
          <h3 className="font-display font-bold">다운로드 비밀번호</h3>
          <p className="text-xs text-[color:var(--color-ink-soft)] mt-1">
            외부에서 비공개 자료(강사 카드 · 통장 · 신분증)를 받을 때 입력하는 비밀번호입니다.
            <span className="ml-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[color:var(--color-cream)] border border-[color:var(--color-line)] text-[10px] font-semibold align-middle">
              현재 출처:&nbsp;
              {source === "db" ? (
                <span className="text-emerald-700">DB</span>
              ) : (
                <span className="text-amber-700">환경변수</span>
              )}
            </span>
          </p>
        </div>
      </div>

      <form onSubmit={save} className="mt-4 grid gap-3">
        <label className="block">
          <span className="text-xs font-semibold text-[color:var(--color-wood)]">새 비밀번호</span>
          <input
            type={show ? "text" : "password"}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoComplete="new-password"
            placeholder="4자 이상"
            className="mt-1 w-full rounded-lg border border-[color:var(--color-line)] bg-white px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-[color:var(--color-wood)]">새 비밀번호 확인</span>
          <input
            type={show ? "text" : "password"}
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            autoComplete="new-password"
            placeholder="다시 입력"
            className="mt-1 w-full rounded-lg border border-[color:var(--color-line)] bg-white px-3 py-2 text-sm"
          />
        </label>
        <label className="inline-flex items-center gap-2 text-xs text-[color:var(--color-ink-soft)]">
          <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} />
          비밀번호 표시
        </label>

        {msg && (
          <p
            className={`text-xs rounded p-2 border ${
              msg.kind === "ok"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {msg.text}
          </p>
        )}

        <div className="flex flex-wrap gap-2 justify-end">
          {source === "db" && (
            <button type="button" onClick={reset} disabled={busy} className="btn btn-ghost text-sm disabled:opacity-50">
              <Icon icon="mdi:restore" /> 환경변수 값으로 초기화
            </button>
          )}
          <button type="submit" disabled={busy || !pw || !pw2} className="btn btn-primary text-sm disabled:opacity-50">
            {busy ? (
              <>
                <Icon icon="mdi:loading" className="animate-spin" /> 저장 중
              </>
            ) : (
              <>
                <Icon icon="mdi:content-save-outline" /> 비밀번호 변경
              </>
            )}
          </button>
        </div>
      </form>

      <p className="mt-3 text-[11px] text-[color:var(--color-ink-soft)] leading-relaxed">
        저장된 비밀번호는 해시(bcrypt)로 보관되며, 평문은 어느 곳에도 남지 않습니다. 변경 즉시 외부 다운로드 페이지에 적용됩니다.
      </p>
    </div>
  );
}
