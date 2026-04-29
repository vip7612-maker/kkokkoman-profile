export const env = {
  instructorEmail: process.env.INSTRUCTOR_EMAIL ?? "vip7612@gmail.com",
  instructorName: process.env.INSTRUCTOR_NAME ?? "김춘홍 (꼬꼬맨)",
  resendKey: process.env.RESEND_API_KEY ?? "",
  resendFrom: process.env.RESEND_FROM ?? "onboarding@resend.dev",
  downloadPassword: process.env.DOWNLOAD_PASSWORD ?? "kkokkoman2026",
  adminEmail: process.env.ADMIN_EMAIL ?? "vip7612@gmail.com",
  adminPassword: process.env.ADMIN_PASSWORD ?? "admin1234",
  sessionSecret:
    process.env.SESSION_SECRET ?? "please-change-this-32byte-secret-string!",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};
