"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";

export function DownloadGate({ fileId, filename }: { fileId: number; filename: string }) {
  const [open, setOpen] = useState(false);
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/downloads/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId, password: pw }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "비밀번호 확인 실패");
      window.location.href = `/api/downloads/${json.token}`;
      setOpen(false);
      setPw("");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "오류");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn btn-primary text-xs md:text-sm shrink-0">
        <Icon icon="mdi:lock-outline" /> <span className="hidden sm:inline">다운로드</span>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm p-4">
          <form onSubmit={submit} className="card p-6 w-full max-w-sm">
            <div className="flex items-center gap-2 text-[color:var(--color-wood)]">
              <Icon icon="mdi:shield-key-outline" className="text-xl" />
              <h3 className="font-display text-lg font-bold">자료 다운로드</h3>
            </div>
            <p className="text-xs text-[color:var(--color-ink-soft)] mt-1 leading-relaxed">
              <b>{filename}</b> 파일은 비밀번호 인증이 필요합니다.
              인증 후 24시간 이내에 다운로드하실 수 있습니다.
            </p>
            <input
              type="password"
              autoFocus
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="강사가 안내한 비밀번호"
              className="mt-3 w-full rounded-lg border border-[color:var(--color-line)] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[color:var(--color-beige-deep)]"
            />
            {err && (
              <p className="mt-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded p-2">{err}</p>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost text-sm">취소</button>
              <button type="submit" disabled={busy || !pw} className="btn btn-primary text-sm disabled:opacity-50">
                {busy ? <><Icon icon="mdi:loading" className="animate-spin" /> 확인 중</> : <><Icon icon="mdi:download" /> 다운로드</>}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
