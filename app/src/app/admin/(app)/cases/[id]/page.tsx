import { notFound } from "next/navigation";
import { db, schema } from "@/db/client";
import { eq } from "drizzle-orm";
import { CaseEditor } from "@/components/admin/case-editor";

export const metadata = { title: "강의 사례 수정 · 어드민" };

export default async function EditCasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item] = await db
    .select()
    .from(schema.cases)
    .where(eq(schema.cases.id, Number(id)))
    .limit(1);
  if (!item) notFound();
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-bold text-[color:var(--color-wood)]">강의 사례 수정</h1>
      <div className="mt-6">
        <CaseEditor
          mode="edit"
          initial={{
            id: item.id,
            slug: item.slug,
            title: item.title,
            summary: item.summary,
            coverImage: item.coverImage ?? "",
            bodyMd: item.bodyMd,
            orgName: item.orgName ?? "",
            lecturedAt: item.lecturedAt ?? "",
            published: item.published,
          }}
        />
      </div>
    </div>
  );
}
