// 간단 HTTP 스모크: dev 서버가 떠있는 동안 주요 페이지/엔드포인트를 검증
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const BASE = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3100";

type Check = { name: string; method?: string; path: string; expect?: number; contains?: string; bodyJson?: unknown };

const checks: Check[] = [
  { name: "home (/)", path: "/", contains: "연주하는 꼬꼬맨" },
  { name: "profile", path: "/profile", contains: "수상 경력" },
  { name: "cases", path: "/cases", contains: "강의 사례" },
  { name: "case detail (sample)", path: "/cases/sangji-music-psy", contains: "강의 후기" },
  { name: "request page", path: "/request", contains: "강의 요청" },
  { name: "downloads page", path: "/downloads", contains: "강사 자료 다운로드" },
  { name: "admin login page", path: "/admin/login", contains: "관리자 로그인" },
  { name: "POST /api/request (validation should fail)", method: "POST", path: "/api/request", expect: 400, bodyJson: {} },
  { name: "POST /api/downloads/token wrong pw", method: "POST", path: "/api/downloads/token", expect: 401, bodyJson: { fileId: 999, password: "wrong" } },
  { name: "GET /api/downloads/bad token", path: "/api/downloads/abc", expect: 401 },
];

async function run(check: Check) {
  const init: RequestInit = { method: check.method ?? "GET" };
  if (check.bodyJson !== undefined) {
    init.headers = { "Content-Type": "application/json" };
    init.body = JSON.stringify(check.bodyJson);
  }
  const res = await fetch(BASE + check.path, init);
  const body = await res.text();
  const expectStatus = check.expect ?? 200;
  const okStatus = res.status === expectStatus;
  const okContains = check.contains ? body.includes(check.contains) : true;
  const ok = okStatus && okContains;
  return { ok, status: res.status, expectStatus, name: check.name, hint: !okContains ? `missing "${check.contains}"` : "" };
}

async function waitFor(url: string, timeoutMs = 60_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(url);
      if (r.status < 500) return true;
    } catch {}
    await sleep(500);
  }
  return false;
}

async function main() {
  const port = "3100";
  const base = `http://127.0.0.1:${port}`;
  console.log(`[smoke] starting next dev on ${base}`);
  const proc = spawn("pnpm", ["next", "dev", "-p", port], {
    cwd: process.cwd(),
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, NODE_ENV: "development" },
  });
  let ready = false;
  proc.stdout.on("data", (d) => process.stdout.write(`[next] ${d}`));
  proc.stderr.on("data", (d) => process.stderr.write(`[next!] ${d}`));

  try {
    ready = await waitFor(base + "/", 90_000);
    if (!ready) throw new Error("dev server did not become ready in time");

    let pass = 0, fail = 0;
    for (const c of checks) {
      const r = await run({ ...c, path: c.path });
      const status = r.ok ? "✅" : "❌";
      console.log(`${status} ${c.name} → ${r.status} (expect ${r.expectStatus}) ${r.hint}`);
      r.ok ? pass++ : fail++;
    }
    console.log(`\n[smoke] ${pass} passed, ${fail} failed`);
    process.exit(fail === 0 ? 0 : 1);
  } finally {
    proc.kill("SIGTERM");
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
