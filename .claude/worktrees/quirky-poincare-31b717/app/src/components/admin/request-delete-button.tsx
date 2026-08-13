"use client";
import { Icon } from "@iconify/react";
import { useState } from "react";

export function RequestDeleteButton({
  id,
  organization,
}: {
  id: number;
  organization: string;
}) {
  const [busy, setBusy] = useState(false);

  async function del() {
    if (
      !confirm(
        `정말 삭제하시겠습니까?\n\n"${organization}" 요청과 일정 정보가 모두 사라집니다.`,
      )
    )
      return;
    setBusy(true);
    const res = await fetch(`/api/admin/requests/${id}`, { method: "DELETE" });
    if (res.ok) {
      location.reload();
    } else {
      alert("삭제 실패");
      setBusy(false);
    }
  }

  return (
    <button
      onClick={del}
      disabled={busy}
      className="grid place-items-center size-9 rounded-full hover:bg-rose-50 text-rose-600 disabled:opacity-50 border border-transparent hover:border-rose-200"
      aria-label="요청 삭제"
      title="요청 삭제"
    >
      <Icon icon={busy ? "mdi:loading" : "mdi:trash-can-outline"} className={busy ? "animate-spin" : ""} />
    </button>
  );
}
