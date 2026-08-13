import "./_env";
import { db, schema } from "../src/db/client";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

type SeedCase = {
  slug: string;
  title: string;
  summary: string;
  coverImage: string;
  bodyMd: string;
  orgName: string;
  lecturedAt: string;
  extraImages?: { url: string; caption?: string }[];
};

const cases: SeedCase[] = [
  {
    slug: "sangji-music-psy",
    title: "상지대학교 사회복지학과 — 음악으로 마음을 잇다",
    summary:
      "사회복지학을 공부하는 학생들과 함께한 팬플룻 음악심리 특강. 연주와 이야기를 통해 클라이언트를 이해하는 새로운 시선을 나눴습니다.",
    coverImage: "/uploads/case-sangji.jpg",
    orgName: "상지대학교 사회복지학과",
    lecturedAt: "2025-11-10",
    bodyMd: `## 강의 후기

상지대학교 사회복지학과 학생들과 함께 음악심리 특강을 진행했습니다.
무거운 사회복지 현장에서 클라이언트의 마음을 어떻게 두드릴 수 있는지,
**팬플룻 연주와 함께 풀어낸 시간**이었어요.

![강의 모습](/uploads/case-sangji.jpg)

### 함께 나눈 주제
- 음악심리 상담의 기초
- 현장에서 만난 작은 기적들
- 진로 코칭과 자존감 회복

> "교수님 같지 않은 강사님이 좋았어요. 진짜 사람 이야기 같았습니다."
> — 학생 후기
`,
  },
  {
    slug: "knowledge-share-forum",
    title: "지식나눔 시브아 포럼 — 음악과 영감의 밤",
    summary:
      "다양한 분야의 지식 공유자들이 모인 포럼에서 팬플룻 연주와 짧은 강연을 함께 풀어낸 저녁. 음악이 언어가 되는 순간을 함께 경험했습니다.",
    coverImage: "/uploads/case-forum.jpg",
    orgName: "지식나눔 시브아 포럼",
    lecturedAt: "2025-12-04",
    extraImages: [
      { url: "/uploads/case-forum-talk.jpg", caption: "음악에 담긴 이야기를 함께 풀어낸 시간" },
    ],
    bodyMd: `## 음악으로 시작한 짧은 강연

지식나눔 포럼은 다양한 분야의 사람들이 모여 자기 이야기를 나누는 자리입니다.
저는 무대 가운데에서 **팬플룻을 먼저 연주**한 뒤, 그 곡에 담긴 이야기를 풀어냈어요.

![무대 위 연주](/uploads/case-forum.jpg)

### 이날 함께 나눈 곡들
- 〈El Cóndor Pasa〉 — 자유로움에 대하여
- 〈고향의 봄〉 — 다시 찾아오는 마음
- 〈Amazing Grace〉 — 회복의 노래

연주가 끝날 때마다 객석은 잠시 숨을 멈췄고, 그 침묵이 곧 다음 이야기로 연결됐습니다.

![짧은 강연](/uploads/case-forum-talk.jpg)

> "음악으로 한 줄 시를 들은 듯한 시간이었어요." — 참가자 후기
`,
  },
  {
    slug: "cafe-koria-spring",
    title: "카페 코리안 — 봄날의 작은 콘서트",
    summary:
      "지역 카페에서 열린 작은 살롱 콘서트. 일상의 공간이 음악으로 잠시 다른 결로 바뀌는 따뜻한 오후였습니다.",
    coverImage: "/uploads/case-cafe.jpg",
    orgName: "카페 코리안 (강원)",
    lecturedAt: "2025-09-21",
    bodyMd: `## 일상에 스며든 음악

테이블 너머에서 커피 향이 올라오는 작은 카페에서, 마이크 한 대와 함께 팬플룻을 들었습니다.
**큰 무대보다 더 가깝게**, 손님 한 분 한 분의 표정을 보며 연주할 수 있는 자리였어요.

![카페 무대](/uploads/case-cafe.jpg)

### 이날의 셋리스트
- 〈El Cóndor Pasa〉
- 〈가시나무〉
- 〈사랑으로〉
- 〈오빠 생각〉(앙코르)

> "커피 한 잔이 길게 느껴지는, 그런 한 시간이었어요."
`,
  },
  {
    slug: "dome-acoustic-night",
    title: "글램핑 돔에서의 어쿠스틱 무대",
    summary:
      "야외 글램핑 돔에서 열린 어쿠스틱 공연. 팬플룻 사이사이에 클래식 기타 연주를 더해, 자연 속에서 음악이 어떻게 퍼져나가는지를 함께 느꼈습니다.",
    coverImage: "/uploads/case-dome-guitar.jpg",
    orgName: "야외 글램핑 페스티벌",
    lecturedAt: "2026-03-15",
    bodyMd: `## 자연 속의 어쿠스틱

투명한 돔 천장 너머로 별이 보이는 야외 무대였습니다.
이날은 팬플룻만이 아니라 **클래식 기타 솔로**도 함께 준비했어요.

![돔 안의 솔로 무대](/uploads/case-dome-guitar.jpg)

### 무대 구성
1. 팬플룻 솔로 — 바람의 노래
2. 클래식 기타 솔로 — 알함브라 궁전의 추억 (발췌)
3. 팬플룻 + 기타 — 〈We Are the Reason〉
4. 관객과 함께 부르는 〈사랑으로〉

차가운 공기 속에서 사람들의 입김이 조명에 반사되던 순간이 잊히지 않습니다.

> "도시 한가운데에서 산속 새벽을 만난 기분이었어요."
`,
  },
  {
    slug: "naean-hospital-healing",
    title: "내안에병원 — 마음을 어루만지는 음악 시간",
    summary:
      "정신건강의학과 환우들과 의료진을 위한 작은 음악 시간. 연주와 짧은 이야기로 마음의 무게를 함께 나누었습니다.",
    coverImage: "/uploads/profile-hero.jpg",
    orgName: "내안에병원 (정신건강의학)",
    lecturedAt: "2026-02-22",
    bodyMd: `## 병원 안의 작은 음악회

내안에병원에서는 **정기적으로 환우와 의료진을 위한 음악 시간**을 진행하고 있습니다.
큰 박수가 필요한 자리는 아니에요. 그저 잠시 호흡을 고를 시간을 함께 만드는 시간이지요.

### 함께한 곡들
- 〈동무생각〉 — 잊혀진 시절의 다정함
- 〈El Cóndor Pasa〉 — 마음의 자유에 대하여
- 〈고향의 봄〉 — 처음으로 안전했던 기억

연주가 끝나고 한 분이 가만히 다가와 “선생님, 오늘 처음으로 울었어요.”라고 말씀해 주셨습니다.
음악이 닿을 수 있는 자리가 어디인지 다시 한번 배우는 시간이었어요.

> 음악은 종종 말보다 먼저 마음에 닿습니다.
`,
  },
];

async function upsertCase(c: SeedCase) {
  const existing = await db
    .select()
    .from(schema.cases)
    .where(eq(schema.cases.slug, c.slug))
    .limit(1);
  if (existing.length === 0) {
    const [row] = await db
      .insert(schema.cases)
      .values({
        slug: c.slug,
        title: c.title,
        summary: c.summary,
        coverImage: c.coverImage,
        bodyMd: c.bodyMd,
        orgName: c.orgName,
        lecturedAt: c.lecturedAt,
        published: true,
      })
      .returning({ id: schema.cases.id });
    if (c.extraImages?.length) {
      await db.insert(schema.caseImages).values(
        c.extraImages.map((img, i) => ({
          caseId: row.id,
          url: img.url,
          caption: img.caption ?? null,
          sortOrder: i,
        })),
      );
    }
    console.log("[seed] case inserted:", c.slug);
  } else {
    await db
      .update(schema.cases)
      .set({
        title: c.title,
        summary: c.summary,
        coverImage: c.coverImage,
        bodyMd: c.bodyMd,
        orgName: c.orgName,
        lecturedAt: c.lecturedAt,
      })
      .where(eq(schema.cases.id, existing[0].id));
    if (c.extraImages?.length) {
      // 기존 extra image 정리 후 새로 삽입
      await db
        .delete(schema.caseImages)
        .where(eq(schema.caseImages.caseId, existing[0].id));
      await db.insert(schema.caseImages).values(
        c.extraImages.map((img, i) => ({
          caseId: existing[0].id,
          url: img.url,
          caption: img.caption ?? null,
          sortOrder: i,
        })),
      );
    }
    console.log("[seed] case updated:", c.slug);
  }
}

async function main() {
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

  for (const c of cases) {
    await upsertCase(c);
  }

  console.log("[seed] done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
