import { Icon } from "@iconify/react";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { LoginForm } from "@/components/login-form";

export const metadata = { title: "관리자 로그인 · 꼬꼬맨" };

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin");
  return (
    <div className="mx-auto max-w-md px-5 py-20">
      <div className="card p-8">
        <div className="flex items-center gap-2 text-[color:var(--color-wood)]">
          <Icon icon="mdi:shield-account-outline" className="text-2xl" />
          <h1 className="font-display text-2xl font-bold">관리자 로그인</h1>
        </div>
        <p className="text-sm text-[color:var(--color-ink-soft)] mt-1">
          꼬꼬맨 사이트 관리자 전용 페이지입니다.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
