"use client";
import { useState } from "react";

const OPTS = [
  { v: "new", label: "새 요청" },
  { v: "contacted", label: "연락중" },
  { v: "confirmed", label: "확정" },
  { v: "done", label: "완료" },
  { v: "canceled", label: "취소" },
];

export function RequestStatusSelect({ id, value }: { id: number; value: string }) {
  const [v, setV] = useState(value);
  const [busy, setBusy] = useState(false);

  async function update(next: string) {
    setBusy(true);
    setV(next);
    await fetch(`/api/admin/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusy(false);
  }

  return (
    <select
      disabled={busy}
      value={v}
      onChange={(e) => update(e.target.value)}
      className="rounded-full bg-[color:var(--color-cream)] border border-[color:var(--color-line)] px-3 py-1.5 text-xs font-medium"
    >
      {OPTS.map((o) => (
        <option key={o.v} value={o.v}>{o.label}</option>
      ))}
    </select>
  );
}
