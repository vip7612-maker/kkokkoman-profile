"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { useState } from "react";
import { draftToMarkdown } from "@/lib/draft-to-markdown";
import { youtubeEmbedUrl } from "@/lib/youtube";

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
  youtubeUrl: string;
  galleryImages: string[];
  published: boolean;
};

const GALLERY_SLOTS = 3;

function padGallery(arr: string[]): string[] {
  const padded = [...arr];
  while (padded.length < GALLERY_SLOTS) padded.push("");
  return padded.slice(0, GALLERY_SLOTS);
}

export function CaseEditor({ mode, initial }: { mode: Mode; initial?: Initial }) {
  const [form, setForm] = useState<Omit<Initial, "id">>({
    slug: initial?.slug ?? "",
    title: initial?.title ?? "",
    summary: initial?.summary ?? "",
    coverImage: initial?.coverImage ?? "",
    bodyMd: initial?.bodyMd ?? "## 강의 후기\n\n\n## 현장 사진\n\n\n",
    orgName: initial?.orgName ?? "",
    lecturedAt: initial?.lecturedAt ?? "",
    youtubeUrl: initial?.youtubeUrl ?? "",
    galleryImages: padGallery(initial?.galleryImages ?? []),
    published: initial?.published ?? true,
  });
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function updateGalleryAt(idx: number, url: string) {
    setForm((p) => {
      const next = padGallery(p.galleryImages);
      next[idx] = url;
      return { ...p, galleryImages: next };
    });
  }

  async function uploadImage(
    file: File,
    target: "cover" | "body" | { gallery: number },
  ) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", "case");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "업로드 실패");
      if (target === "cover") update("coverImage", json.url);
      else if (target === "body") update("bodyMd", `${form.bodyMd}\n\n![](${json.url})\n`);
      else updateGalleryAt(target.gallery, json.url);
    } catch (e) {
      alert(e instanceof Error ? e.message : "업로드 실패");
    } finally {
      setUploading(false);
    }
  }

  function applyDraft(replace: boolean) {
    const md = draftToMarkdown(draft);
    if (!md) return;
    if (replace) {
      update("bodyMd", md);
    } else {
      const sep = form.bodyMd && !form.bodyMd.endsWith("\n") ? "\n\n" : form.bodyMd.endsWith("\n\n") ? "" : "\n";
      update("bodyMd", `${form.bodyMd}${sep}${md}\n`);
    }
    setDraft("");
  }

  async function submit() {
    setBusy(true);
    setErr(null);
    try {
      const url =
        mode === "create" ? "/api/admin/cases" : `/api/admin/cases/${initial!.id}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const payload = {
        ...form,
        galleryImages: form.galleryImages.filter((u) => u.trim()).slice(0, GALLERY_SLOTS),
      };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

  const embed = youtubeEmbedUrl(form.youtubeUrl);

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

      <Field
        label="YouTube 영상 URL"
        hint="강의 영상이 있다면 붙여넣으세요. 사례 페이지에 자동으로 임베드됩니다."
      >
        <input
          value={form.youtubeUrl}
          onChange={(e) => update("youtubeUrl", e.target.value)}
          className={inputCls}
          placeholder="https://www.youtube.com/watch?v=... 또는 https://youtu.be/..."
        />
        {form.youtubeUrl && !embed && (
          <p className="text-xs text-amber-700 mt-1 inline-flex items-center gap-1">
            <Icon icon="mdi:alert-circle-outline" /> 인식할 수 없는 URL입니다. 영상 ID를 확인해주세요.
          </p>
        )}
        {embed && (
          <div className="mt-2 aspect-video w-full max-w-md rounded-lg overflow-hidden border border-[color:var(--color-line)] bg-black">
            <iframe
              src={embed}
              title="YouTube 미리보기"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </Field>

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

      <Field
        label="본문 자동 생성 도우미"
        hint="대략적으로 적어주시면 단락·글머리표를 정리해 본문에 넣어드립니다."
      >
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={5}
          className={`${inputCls} resize-y`}
          placeholder={"예)\n오늘 상지대학교 사회복지학과에서 음악심리 특강을 했다.\n학생 80명이 참여했고 반응이 뜨거웠다.\n\n- 음악으로 마음 열기\n- 합주 활동\n- 마무리 소감 나누기"}
        />
        <div className="flex flex-wrap gap-2 mt-2 justify-end">
          <button
            type="button"
            onClick={() => applyDraft(false)}
            disabled={!draft.trim()}
            className="btn btn-ghost text-sm disabled:opacity-50"
          >
            <Icon icon="mdi:playlist-plus" /> 본문에 추가
          </button>
          <button
            type="button"
            onClick={() => applyDraft(true)}
            disabled={!draft.trim()}
            className="btn btn-primary text-sm disabled:opacity-50"
          >
            <Icon icon="mdi:auto-fix" /> 본문에 적용 (덮어쓰기)
          </button>
        </div>
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

      <Field
        label="갤러리 이미지 (최대 3장)"
        hint="본문 아래에 그리드로 노출됩니다."
      >
        <div className="grid gap-3">
          {form.galleryImages.map((url, idx) => (
            <div key={idx} className="grid sm:grid-cols-[80px_1fr_auto] gap-2 items-center">
              <div className="size-20 rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-cream)] overflow-hidden grid place-items-center">
                {url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Icon icon="mdi:image-outline" className="text-[color:var(--color-ink-soft)] text-2xl" />
                )}
              </div>
              <input
                value={url}
                onChange={(e) => updateGalleryAt(idx, e.target.value)}
                className={inputCls}
                placeholder={`${idx + 1}번째 이미지 URL`}
              />
              <div className="flex gap-1">
                <label className="btn btn-ghost text-sm cursor-pointer">
                  <Icon icon="mdi:upload" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files?.[0] && uploadImage(e.target.files[0], { gallery: idx })
                    }
                  />
                </label>
                {url && (
                  <button
                    type="button"
                    onClick={() => updateGalleryAt(idx, "")}
                    className="grid place-items-center size-9 rounded-lg text-rose-600 hover:bg-rose-50"
                    aria-label="제거"
                  >
                    <Icon icon="mdi:close" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
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
        <Link href="/admin/cases" className="btn btn-ghost">취소</Link>
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
