import { auth } from "@/auth";
import { db } from "@/lib/db";
import { snippets } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import CopyButton from "@/components/copy-button";
import CodeBlock from "@/components/code-block";
import TagManager from "@/components/tag-manager";

export default async function SnippetPage({
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-900 transition mb-2 block"
          >
            ← Back to Vault
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">{snippet.title}</h2>
          {snippet.description && (
            <p className="text-gray-500 text-sm mt-1">{snippet.description}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-mono">
            {snippet.language}
          </span>
          <CopyButton code={snippet.code} />
          <Link
            href={`/dashboard/snippets/${snippet.id}/edit`}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
          >
            Edit
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <CodeBlock code={snippet.code} language={snippet.language} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <TagManager snippetId={snippet.id} />
      </div>
    </div>
  );
}
