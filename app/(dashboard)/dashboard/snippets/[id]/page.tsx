import { auth } from "@/auth";
import { db } from "@/lib/db";
import { snippets } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import CopyButton from "@/components/copy-button";
import CodeBlock from "@/components/code-block";

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

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
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="text-[10px] tracking-widest text-white/20 hover:text-white/50 transition mb-6 block"
        >
          ← SNIPPETS
        </Link>

        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <h2 className="text-xl font-mono text-white leading-snug">{snippet.title}</h2>
            {snippet.description && (
              <p className="text-sm text-white/30 mt-2">{snippet.description}</p>
            )}
            <div className="flex items-center gap-4 mt-3">
              <span className="text-[10px] font-mono text-white/20 border border-white/10 px-1.5 py-0.5">
                {snippet.language}
              </span>
              <span className="text-[10px] text-white/15 font-mono">
                {formatDate(new Date(snippet.createdAt))}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 mt-1">
            <CopyButton code={snippet.code} />
            <Link
              href={`/dashboard/snippets/${snippet.id}/edit`}
              className="text-xs text-black bg-white px-3 py-1.5 hover:bg-white/90 transition font-medium"
            >
              edit
            </Link>
          </div>
        </div>
      </div>

      <div className="border border-white/10 overflow-hidden">
        <CodeBlock code={snippet.code} language={snippet.language} />
      </div>
    </div>
  );
}
