import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

const ts = () =>
  integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`);

// 강의 신청
export const lectureRequests = sqliteTable("lecture_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organization: text("organization").notNull(),
  contactName: text("contact_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  audience: text("audience").notNull(),
  headcount: integer("headcount").notNull(),
  budget: text("budget"),
  message: text("message"),
  status: text("status").notNull().default("new"), // new | contacted | confirmed | done | canceled
  createdAt: ts(),
});

export const lectureRequestDates = sqliteTable("lecture_request_dates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  requestId: integer("request_id")
    .notNull()
    .references(() => lectureRequests.id, { onDelete: "cascade" }),
  date: text("date").notNull(), // YYYY-MM-DD
  timeFrom: text("time_from"),
  timeTo: text("time_to"),
  location: text("location"),
});

// 강의 사례 (블로그)
export const cases = sqliteTable("cases", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  coverImage: text("cover_image"),
  bodyMd: text("body_md").notNull(),
  orgName: text("org_name"),
  lecturedAt: text("lectured_at"), // YYYY-MM-DD
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  createdAt: ts(),
});

export const caseImages = sqliteTable("case_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  caseId: integer("case_id")
    .notNull()
    .references(() => cases.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  caption: text("caption"),
  sortOrder: integer("sort_order").notNull().default(0),
});

// 보호 파일
export const secureFiles = sqliteTable("secure_files", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  kind: text("kind").notNull(), // proposal | card | bank | id
  label: text("label").notNull(),
  filename: text("filename").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  storagePath: text("storage_path").notNull(),
  // 공개 다운로드 (비번 불필요): 강의 제안서 등
  isPublic: integer("is_public", { mode: "boolean" }).notNull().default(false),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const downloadLogs = sqliteTable("download_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fileId: integer("file_id").references(() => secureFiles.id, {
    onDelete: "set null",
  }),
  ip: text("ip"),
  ua: text("ua"),
  createdAt: ts(),
});

// 관리자
export const admins = sqliteTable("admins", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: ts(),
});

// 사이트 설정 (전화/카톡/SNS 등)
export const siteSettings = sqliteTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});
