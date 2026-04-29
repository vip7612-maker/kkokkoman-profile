"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";

export function LoginForm() {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: String(fd.get("email") ?? ""),
        password: String(fd.get("password") ?? ""),
      }),
    });
    const json = await res.json();
    if (res.ok && json.ok) {
      window.location.href = "/admin";
      return;
    }
    setErr(json.error ?? "로그인 실패");
    setBusy(false);
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-3">
      <label className="block">
        <span className="text-xs font-semibold text-[color:var(--color-wood)]">이메일</span>
        <input
          name="email"
          type="email"
          required
          defaultValue="vip7612@gmail.com"
          className="mt-1 w-full rounded-lg border border-[color:var(--color-line)] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[color:var(--color-beige-deep)]"
        />
      </label>
      <label className="block">
        <span className="text-xs font-semibold text-[color:var(--color-wood)]">비밀번호</span>
        <input
          name="password"
          type="password"
          required
          className="mt-1 w-full rounded-lg border border-[color:var(--color-line)] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[color:var(--color-beige-deep)]"
        />
      </label>
      {err && (
        <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded p-2">{err}</p>
      )}
      <button type="submit" disabled={busy} className="btn btn-primary mt-2 disabled:opacity-50">
        {busy ? <><Icon icon="mdi:loading" className="animate-spin" /> 확인 중</> : <><Icon icon="mdi:login" /> 로그인</>}
      </button>
    </form>
  );
}
