# 꼬꼬맨(김춘흥) 강사 프로필 사이트

팬플룻 연주자 김춘흥(예명: 연주하는 꼬꼬맨)의 강사 프로필 사이트.

- 프로필/학력/자격/수상/활동 소개
- 강의 요청 폼 (희망 일정 다중 입력 → 강사 이메일로 즉시 발송)
- 강사 자료 다운로드 (강사 카드/통장사본/신분증사본, 비밀번호 보호 + 5분 서명 URL)
- 강의 사례 블로그 (메인 썸네일, 상세 페이지)
- 관리자 페이지 (대시보드, 강의사례 CRUD, 요청 조회·상태 변경, 자료 업로드/삭제)

## 기술 스택

| 영역 | 기술 |
|---|---|
| 프레임워크 | Next.js 16 (App Router) + TypeScript |
| 스타일 | Tailwind CSS v4 |
| DB | Turso (libSQL) + Drizzle ORM |
| 이메일 | Resend (미설정시 콘솔 폴백) |
| 인증 | jose (JWT 세션 쿠키) + bcryptjs |
| 아이콘 | @iconify/react |
| 테스트 | Vitest + 자체 HTTP 스모크 |

## 빠르게 시작하기

```bash
cd app
pnpm install
pnpm db:migrate
pnpm db:seed     # 관리자/샘플 사례 시드
pnpm dev         # http://localhost:3000
```

기본 계정 (env에서 변경 가능):
- 관리자: `vip7612@gmail.com` / `admin1234`  → `/admin/login`
- 다운로드 비번: `kkokkoman2026`

## 주요 환경변수 (`app/.env.local`)

```env
TURSO_DATABASE_URL=file:./local.db
TURSO_AUTH_TOKEN=
INSTRUCTOR_EMAIL=vip7612@gmail.com
RESEND_API_KEY=
RESEND_FROM=onboarding@resend.dev
DOWNLOAD_PASSWORD=kkokkoman2026
ADMIN_EMAIL=vip7612@gmail.com
ADMIN_PASSWORD=admin1234
SESSION_SECRET=please-change-this-32byte-secret-string
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

운영 시:
- `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` → Turso 클라우드 값으로 교체
- `RESEND_API_KEY` → 발급받아 입력 (없으면 메일은 콘솔 출력만)
- `SESSION_SECRET` 무작위 32바이트로 변경
- `DOWNLOAD_PASSWORD` / `ADMIN_PASSWORD` 변경

## 폴더 구조

```
app/
├── src/
│   ├── app/                 # Next App Router
│   │   ├── page.tsx         # 메인
│   │   ├── profile/         # 프로필
│   │   ├── cases/           # 강의 사례 목록·상세
│   │   ├── request/         # 강의 요청 폼
│   │   ├── downloads/       # 강사 자료 (비번 보호)
│   │   ├── admin/
│   │   │   ├── login/       # 로그인 (공개)
│   │   │   └── (app)/       # 보호 라우트 그룹
│   │   │       ├── page.tsx          # 대시보드
│   │   │       ├── cases/            # 사례 CRUD
│   │   │       ├── requests/         # 요청 조회
│   │   │       └── files/            # 자료 업로드
│   │   └── api/             # 서버 라우트
│   ├── components/          # UI 컴포넌트
│   ├── db/                  # Drizzle 스키마/클라이언트
│   └── lib/                 # 유틸·인증·메일·다운로드 토큰·프로필
├── drizzle/                 # 마이그레이션 SQL
├── scripts/                 # seed.ts, smoke.ts
├── tests/                   # vitest 유닛 테스트
├── public/uploads/          # 강의 사례 이미지 (공개)
└── private/secure-files/    # 강사 자료 (비공개)
```

## 검증 (CLAUDE.md 하네스 규약)

```bash
pnpm test    # vitest unit (8 tests)
pnpm smoke   # next dev 자동 기동 → 10 endpoints HTTP 검증
pnpm build   # 프로덕션 빌드
```

## 배포

Vercel 권장 (CLAUDE.md GitHub 연동 정책 준수).

1. GitHub에 push
2. Vercel에서 import → root를 `app/`으로 지정
3. 환경변수 세팅 (위 목록 참고)
4. Turso 클라우드로 DB 전환 (`turso db create`)
5. `vercel deploy` 또는 자동 빌드

배포 시 `private/secure-files/` 는 Vercel 파일 시스템에 영속되지 않으므로,
운영 환경에서는 **Vercel Blob** 또는 **R2/S3**로 교체하는 것을 권장합니다.
(현재 코드는 단일 인스턴스에서는 동작합니다.)
