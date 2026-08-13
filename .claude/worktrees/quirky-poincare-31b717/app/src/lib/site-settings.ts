import { db, schema } from "@/db/client";
import { eq } from "drizzle-orm";
import { env } from "./env";

export const SETTING_KEYS = {
  downloadPassword: "download_password",
} as const;

export async function getSetting(key: string): Promise<string | null> {
  const [row] = await db
    .select()
    .from(schema.siteSettings)
    .where(eq(schema.siteSettings.key, key))
    .limit(1);
  return row?.value ?? null;
}

export async function setSetting(key: string, value: string) {
  const existing = await getSetting(key);
  if (existing === null) {
    await db.insert(schema.siteSettings).values({ key, value });
  } else {
    await db
      .update(schema.siteSettings)
      .set({ value })
      .where(eq(schema.siteSettings.key, key));
  }
}

export async function deleteSetting(key: string) {
  await db.delete(schema.siteSettings).where(eq(schema.siteSettings.key, key));
}

/**
 * DB에 저장된 다운로드 비밀번호(bcrypt 해시)를 우선 사용하고,
 * 없으면 환경변수 fallback을 반환한다.
 */
export async function getDownloadPasswordStored(): Promise<{
  value: string;
  source: "db" | "env";
}> {
  const fromDb = await getSetting(SETTING_KEYS.downloadPassword);
  if (fromDb) return { value: fromDb, source: "db" };
  return { value: env.downloadPassword, source: "env" };
}
