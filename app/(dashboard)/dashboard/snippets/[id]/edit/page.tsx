import { auth } from "@/auth";
import { db } from "@/lib/db";
import { snippets } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import EditSnippetForm from "@/components/edit-snippet-form";

export default async function EditSnippetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  const [snippet] = await db
    .select()
    .from(snippets)
    .where(
      and(
        eq(snippets.id, id),
        eq(snippets.userId, session?.user?.id as string)
      )
    )
    .limit(1);

  if (!snippet) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href={`/dashboard/snippets/${snippet.id}`}
          className="text-xs text-white/30 hover:text-white transition mb-3 block"
        >
          ← back to snippet
        </Link>
        <h2 className="text-lg font-mono text-white">edit snippet</h2>
        <p className="text-white/30 text-xs mt-1">update your code snippet</p>
      </div>
      <EditSnippetForm snippet={snippet} />
    </div>
  );
}
