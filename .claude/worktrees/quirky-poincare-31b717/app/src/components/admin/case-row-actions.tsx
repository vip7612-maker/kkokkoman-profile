"use client";
import Link from "next/link";
import { Icon } from "@iconify/react";

export function CaseRowActions({ id, slug }: { id: number; slug: string }) {
  async function del() {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/admin/cases/${id}`, { method: "DELETE" });
    if (res.ok) location.reload();
    else alert("삭제 실패");
  }
  return (
    <div className="inline-flex items-center gap-1">
      <Link href={`/cases/${slug}`} target="_blank" className="grid place-items-center size-8 rounded-lg hover:bg-[color:var(--color-cream)]" aria-label="미리보기">
        <Icon icon="mdi:open-in-new" />
      </Link>
      <Link href={`/admin/cases/${id}`} className="grid place-items-center size-8 rounded-lg hover:bg-[color:var(--color-cream)]" aria-label="수정">
        <Icon icon="mdi:pencil-outline" />
      </Link>
      <button onClick={del} className="grid place-items-center size-8 rounded-lg hover:bg-rose-50 text-rose-600" aria-label="삭제">
        <Icon icon="mdi:trash-can-outline" />
      </button>
    </div>
  );
}
