"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";

type Mode = "create" | "edit";
type Initial = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  coverImage: string;
  bodyMd: string;
  orgName: string;
  lecturedAt: string;
  published: boolean;
};

export function CaseEditor({ mode, initial }: { mode: Mode; initial?: Initial }) {
  const [form, setForm] = useState<Omit<Initial, "id">>({
    slug: initial?.slug ?? "",
    title: initial?.title ?? "",
    summary: initial?.summary ?? "",
    coverImage: initial?.coverImage ?? "",
    bodyMd: initial?.bodyMd ?? "## 강의 후기\n\n\n## 현장 사진\n\n\n",
    orgName: initial?.orgName ?? "",
    lecturedAt: initial?.lecturedAt ?? "",
    published: initial?.published ?? true,
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function uploadImage(file: File, target: "cover" | "body") {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", "case");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "업로드 실패");
      if (target === "cover") update("coverImage", json.url);
      else update("bodyMd", `${form.bodyMd}\n\n![](${json.url})\n`);
    } catch (e) {
      alert(e instanceof Error ? e.message : "업로드 실패");
    } finally {
      setUploading(false);
    }
  }

  async function submit() {
    setBusy(true);
    setErr(null);
    try {
      const url =
        mode === "create" ? "/api/admin/cases" : `/api/admin/cases/${initial!.id}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "저장 실패");
      window.location.href = "/admin/cases";
    } catch (e) {
      setErr(e instanceof Error ? e.message : "저장 실패");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card p-6 grid gap-4">
      <Field label="제목" required>
        <input value={form.title} onChange={(e) => update("title", e.target.value)} className={inputCls} placeholder="예) 상지대학교 사회복지학과 음악심리 특강" />
      </Field>
      <Field label="슬러그(URL)" hint="비워두면 제목으로 자동 생성됩니다.">
        <input value={form.slug} onChange={(e) => update("slug", e.target.value)} className={inputCls} placeholder="sangji-music-psy" />
      </Field>
      <Field label="요약" required>
        <textarea value={form.summary} onChange={(e) => update("summary", e.target.value)} rows={2} className={`${inputCls} resize-y`} />
      </Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="기관">
          <input value={form.orgName} onChange={(e) => update("orgName", e.target.value)} className={inputCls} />
        </Field>
        <Field label="강의일">
          <input type="date" value={form.lecturedAt} onChange={(e) => update("lecturedAt", e.target.value)} className={inputCls} />
        </Field>
      </div>
      <Field label="대표 이미지">
        <div className="flex items-center gap-3">
          <input value={form.coverImage} onChange={(e) => update("coverImage", e.target.value)} className={inputCls} placeholder="/uploads/xxx.jpg 또는 외부 URL" />
          <label className="btn btn-ghost text-sm cursor-pointer">
            <Icon icon="mdi:upload" /> 업로드
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], "cover")}
            />
          </label>
        </div>
        {form.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.coverImage} alt="" className="mt-3 h-40 rounded-lg border border-[color:var(--color-line)] object-cover" />
        )}
      </Field>
      <Field label="본문 (Markdown)" required>
        <div className="flex justify-end">
          <label className="text-xs inline-flex items-center gap-1 text-[color:var(--color-leaf-deep)] cursor-pointer hover:underline">
            <Icon icon="mdi:image-plus-outline" /> 이미지 본문에 삽입
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], "body")}
            />
          </label>
        </div>
        <textarea
          value={form.bodyMd}
          onChange={(e) => update("bodyMd", e.target.value)}
          rows={16}
          className={`${inputCls} font-mono text-sm resize-y`}
        />
      </Field>
      <label className="inline-flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => update("published", e.target.checked)}
        />
        공개
      </label>
      {err && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{err}</p>}
      <div className="flex gap-2">
        <button onClick={submit} disabled={busy || uploading} className="btn btn-primary disabled:opacity-50">
          {busy ? <><Icon icon="mdi:loading" className="animate-spin" /> 저장중</> : <><Icon icon="mdi:content-save-outline" /> 저장</>}
        </button>
        <a href="/admin/cases" className="btn btn-ghost">취소</a>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-[color:var(--color-line)] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[color:var(--color-beige-deep)]";

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[color:var(--color-wood)]">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </span>
      {hint && <span className="block text-xs text-[color:var(--color-ink-soft)] mt-0.5">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
