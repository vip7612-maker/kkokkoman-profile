import "./_env";
import { db, schema } from "../src/db/client";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function main() {
  // 기본 관리자 계정 시드 (.env의 ADMIN_EMAIL/ADMIN_PASSWORD)
  const adminEmail = process.env.ADMIN_EMAIL ?? "jaru1125@naver.com";
  const adminPw = process.env.ADMIN_PASSWORD ?? "admin1234";
  const exist = await db
    .select()
    .from(schema.admins)
    .where(eq(schema.admins.email, adminEmail))
    .limit(1);
  if (exist.length === 0) {
    const hash = await bcrypt.hash(adminPw, 10);
    await db.insert(schema.admins).values({ email: adminEmail, passwordHash: hash });
    console.log("[seed] admin created:", adminEmail);
  } else {
    console.log("[seed] admin already exists:", adminEmail);
  }

  // 샘플 강의 사례 1건
  const sampleSlug = "sangji-music-psy";
  const sample = await db
    .select()
    .from(schema.cases)
    .where(eq(schema.cases.slug, sampleSlug))
    .limit(1);
  if (sample.length === 0) {
    await db.insert(schema.cases).values({
      slug: sampleSlug,
      title: "상지대학교 사회복지학과 — 음악으로 마음을 잇다",
      summary:
        "사회복지학을 공부하는 학생들과 함께한 팬플룻 음악심리 특강. 연주와 이야기를 통해 클라이언트를 이해하는 새로운 시선을 나눴습니다.",
      coverImage: null,
      bodyMd: `## 강의 후기

상지대학교 사회복지학과 학생들과 함께 음악심리 특강을 진행했습니다.
무거운 사회복지 현장에서 클라이언트의 마음을 어떻게 두드릴 수 있는지,
**팬플룻 연주와 함께 풀어낸 시간**이었어요.

### 함께 나눈 주제
- 음악심리 상담의 기초
- 현장에서 만난 작은 기적들
- 진로 코칭과 자존감 회복

> "교수님 같지 않은 강사님이 좋았어요. 진짜 사람 이야기 같았습니다."
> — 학생 후기

## 현장 사진
사진은 추후 업로드됩니다.
`,
      orgName: "상지대학교 사회복지학과",
      lecturedAt: "2025-11-10",
      published: true,
    });
    console.log("[seed] sample case inserted");
  } else {
    console.log("[seed] sample case already exists");
  }

  console.log("[seed] done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
