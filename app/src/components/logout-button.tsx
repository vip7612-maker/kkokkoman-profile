"use client";
import { Icon } from "@iconify/react";

export function LogoutButton() {
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }
  return (
    <button
      onClick={logout}
      className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[color:var(--color-wood-soft)] hover:bg-black/20 text-sm"
    >
      <Icon icon="mdi:logout-variant" /> 로그아웃
    </button>
  );
}
