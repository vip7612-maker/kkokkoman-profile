import Link from "next/link";
import { Icon } from "@iconify/react";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";

export default async function AdminAppLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[240px_1fr] bg-[color:var(--color-bg-alt)]">
      <aside className="bg-[color:var(--color-wood)] text-[color:var(--color-cream)] p-5 md:min-h-screen">
        <div className="font-display text-lg font-bold flex items-center gap-2">
          <Icon icon="mdi:music-clef-treble" />
          꼬꼬맨 어드민
        </div>
        <div className="text-xs opacity-70 mt-1">{admin.email}</div>
        <nav className="mt-6 grid gap-1 text-sm">
          {[
            { href: "/admin", label: "대시보드", icon: "mdi:view-dashboard-outline" },
            { href: "/admin/cases", label: "강의 사례", icon: "mdi:notebook-multiple" },
            { href: "/admin/requests", label: "강의 요청", icon: "mdi:inbox-outline" },
            { href: "/admin/files", label: "강사 자료", icon: "mdi:file-lock-outline" },
          ].map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[color:var(--color-wood-soft)]"
            >
              <Icon icon={n.icon} /> {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6">
          <LogoutButton />
        </div>
        <Link href="/" className="mt-6 inline-flex items-center gap-1 text-xs opacity-80 hover:opacity-100">
          <Icon icon="mdi:arrow-left" /> 사이트로 돌아가기
        </Link>
      </aside>
      <main className="p-6 md:p-10">{children}</main>
    </div>
  );
}
