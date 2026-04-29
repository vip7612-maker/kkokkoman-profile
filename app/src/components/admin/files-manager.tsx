"use client";
import { Icon } from "@iconify/react";
import { useState } from "react";

type F = { id: number; kind: string; label: string; filename: string; size: number; mimeType: string };

const KIND_OPTS = [
  { v: "card", label: "강사 카드", icon: "mdi:account-box-outline" },
  { v: "bank", label: "통장 사본", icon: "mdi:bank-outline" },
  { v: "id", label: "신분증 사본", icon: "mdi:card-account-details-outline" },
];

export function FilesManager({ files }: { files: F[] }) {
  const [busy, setBusy] = useState(false);
  const [kind, setKind] = useState("card");
  const [label, setLabel] = useState("");

  async function upload(file: File) {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", kind);
      if (label) fd.append("label", label);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "업로드 실패");
      location.reload();
    } catch (e) {
      alert(e instanceof Error ? e.message : "업로드 실패");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/admin/files/${id}`, { method: "DELETE" });
    if (res.ok) location.reload();
    else alert("삭제 실패");
  }

  return (
    <div>
      <div className="card p-5">
        <h3 className="font-display font-bold text-[color:var(--color-wood)]">새 자료 업로드</h3>
        <div className="mt-3 grid sm:grid-cols-[180px_1fr_auto] gap-3 items-end">
          <label className="block">
            <span className="text-xs font-semibold text-[color:var(--color-wood)]">종류</span>
            <select value={kind} onChange={(e) => setKind(e.target.value)} className="mt-1 w-full rounded-lg border border-[color:var(--color-line)] bg-white px-3 py-2 text-sm">
              {KIND_OPTS.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-[color:var(--color-wood)]">표시명 (선택)</span>
            <input value={label} onChange={(e) => setLabel(e.target.value)} className="mt-1 w-full rounded-lg border border-[color:var(--color-line)] bg-white px-3 py-2 text-sm" placeholder="예) 강사카드_2026" />
          </label>
          <label className="btn btn-primary cursor-pointer">
            <Icon icon="mdi:upload" /> 파일 선택
            <input type="file" className="hidden" disabled={busy} onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
          </label>
        </div>
        <p className="text-xs text-[color:var(--color-ink-soft)] mt-2">PDF, JPG, PNG 등 일반 문서 파일을 업로드하세요. 최대 10MB 권장.</p>
      </div>

      <div className="mt-6 grid gap-3">
        {files.length === 0 && (
          <div className="card p-8 text-center text-[color:var(--color-ink-soft)]">아직 업로드된 자료가 없습니다.</div>
        )}
        {files.map((f) => {
          const k = KIND_OPTS.find((o) => o.v === f.kind);
          return (
            <div key={f.id} className="card p-4 flex items-center gap-4">
              <div className="grid place-items-center size-12 rounded-2xl bg-[color:var(--color-cream)] text-[color:var(--color-wood)]">
                <Icon icon={k?.icon ?? "mdi:file-outline"} className="text-2xl" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[color:var(--color-wood)]">{f.label} <span className="text-xs text-[color:var(--color-ink-soft)] font-normal">· {k?.label ?? f.kind}</span></div>
                <div className="text-xs text-[color:var(--color-ink-soft)] truncate">{f.filename} · {(f.size / 1024).toFixed(0)} KB</div>
              </div>
              <button onClick={() => remove(f.id)} className="grid place-items-center size-9 rounded-lg hover:bg-rose-50 text-rose-600">
                <Icon icon="mdi:trash-can-outline" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
