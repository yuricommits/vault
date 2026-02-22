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
      <div className="flex items-start justify-between mb-8">
        <div>
          <Link
            href="/dashboard"
            className="text-xs text-white/40 hover:text-white transition mb-3 block"
          >
            ← back
          </Link>
          <p className="text-xs text-white/40 mb-1">// SNIPPET</p>
          <h2 className="text-xl text-white font-bold">{snippet.title}</h2>
          {snippet.description && (
            <p className="text-sm text-white/40 mt-1">{snippet.description}</p>
          )}
        </div>
        <div className="flex items-center gap-3 mt-6">
          <span className="text-xs text-white/40 border border-white/10 px-2 py-1 font-mono">
            {snippet.language}
          </span>
          <CopyButton code={snippet.code} />
          <Link
            href={`/dashboard/snippets/${snippet.id}/edit`}
            className="text-xs text-black bg-white px-3 py-1.5 hover:bg-white/90 transition font-medium"
          >
            edit
          </Link>
        </div>
      </div>

      <div className="border border-white/10 overflow-hidden mb-6">
        <CodeBlock code={snippet.code} language={snippet.language} />
      </div>

      <div className="border border-white/10 p-6">
        <TagManager snippetId={snippet.id} />
      </div>
    </div>
  );
}
