import { Resend } from "resend";
import { env } from "./env";

type MailArgs = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

export async function sendMail({ to, subject, html, replyTo }: MailArgs) {
  if (!env.resendKey) {
    console.log(
      "[mailer] RESEND_API_KEY not set — falling back to console.\n",
      JSON.stringify({ to, subject, replyTo }, null, 2),
      "\n---\n",
      html,
    );
    return { id: "console-fallback", ok: true } as const;
  }
  const resend = new Resend(env.resendKey);
  const result = await resend.emails.send({
    from: `${env.instructorName} <${env.resendFrom}>`,
    to,
    subject,
    html,
    replyTo,
  });
  if (result.error) {
    console.error("[mailer] resend error:", result.error);
    return { id: "", ok: false } as const;
  }
  return { id: result.data?.id ?? "", ok: true } as const;
}

export function renderLectureRequestHtml(data: {
  organization: string;
  contactName: string;
  phone: string;
  email: string;
  audience: string;
  headcount: number;
  budget?: string | null;
  message?: string | null;
  dates: { date: string; timeFrom?: string | null; timeTo?: string | null; location?: string | null }[];
}) {
  const datesRows = data.dates
    .map(
      (d) =>
        `<tr><td>${d.date}</td><td>${d.timeFrom ?? ""} ~ ${d.timeTo ?? ""}</td><td>${d.location ?? ""}</td></tr>`,
    )
    .join("");
  return `
  <div style="font-family:'Pretendard',-apple-system,Segoe UI,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#222">
    <h2 style="color:#3D2817;border-bottom:2px solid #D4A574;padding-bottom:8px">새로운 강의 요청 🎺</h2>
    <table style="width:100%;border-collapse:collapse;margin-top:12px">
      <tr><td style="padding:6px 0;color:#666;width:120px">기관</td><td><b>${data.organization}</b></td></tr>
      <tr><td style="padding:6px 0;color:#666">담당자</td><td>${data.contactName}</td></tr>
      <tr><td style="padding:6px 0;color:#666">연락처</td><td>${data.phone}</td></tr>
      <tr><td style="padding:6px 0;color:#666">이메일</td><td>${data.email}</td></tr>
      <tr><td style="padding:6px 0;color:#666">대상</td><td>${data.audience}</td></tr>
      <tr><td style="padding:6px 0;color:#666">인원</td><td>${data.headcount}명</td></tr>
      ${data.budget ? `<tr><td style="padding:6px 0;color:#666">예산</td><td>${data.budget}</td></tr>` : ""}
    </table>
    <h3 style="margin-top:20px;color:#3D2817">희망 일정</h3>
    <table style="width:100%;border-collapse:collapse;border:1px solid #eee">
      <thead>
        <tr style="background:#F5F0E8;color:#3D2817">
          <th style="padding:8px;text-align:left">날짜</th>
          <th style="padding:8px;text-align:left">시간</th>
          <th style="padding:8px;text-align:left">장소</th>
        </tr>
      </thead>
      <tbody>${datesRows}</tbody>
    </table>
    ${
      data.message
        ? `<h3 style="margin-top:20px;color:#3D2817">메시지</h3><p style="white-space:pre-wrap;background:#FAF6F0;padding:12px;border-radius:8px">${data.message}</p>`
        : ""
    }
    <p style="margin-top:24px;color:#999;font-size:12px">— 연주하는 꼬꼬맨 프로필 사이트에서 자동 발송된 메일입니다.</p>
  </div>`;
}
