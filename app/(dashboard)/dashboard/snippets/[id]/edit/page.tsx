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
          className="text-sm text-gray-500 hover:text-gray-900 transition mb-2 block"
        >
          ← Back to Snippet
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">Edit Snippet</h2>
        <p className="text-gray-500 text-sm mt-1">
          Update your code snippet
        </p>
      </div>
      <EditSnippetForm snippet={snippet} />
    </div>
  );
}
