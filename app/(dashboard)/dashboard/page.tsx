import { auth } from "@/auth";
import { db } from "@/lib/db";
import { snippets } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  const userSnippets = await db
    .select()
    .from(snippets)
    .where(eq(snippets.userId, session?.user?.id as string))
    .orderBy(desc(snippets.createdAt));

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs text-[#666666] mb-2">// SNIPPETS</p>
          <h2 className="text-xl text-white font-bold">Your code vault.</h2>
        </div>
        <Link
          href="/dashboard/snippets/new"
          className="text-xs text-black bg-white px-3 py-1.5 hover:bg-[#ededed] transition font-medium"
        >
          + new snippet
        </Link>
      </div>

      {userSnippets.length === 0 ? (
        <div className="mt-20 text-center">
          <p className="text-white text-xs mb-2">no snippets yet</p>
          <p className="text-[#666666] text-xs mb-8">
            Start by adding your first code snippet.
          </p>
          <Link
            href="/dashboard/snippets/new"
            className="text-xs text-black bg-white px-4 py-2 hover:bg-[#ededed] transition font-medium"
          >
            + new snippet
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-px bg-[#1f1f1f]">
          {userSnippets.map((snippet) => (
            <Link
              key={snippet.id}
              href={`/dashboard/snippets/${snippet.id}`}
              className="flex items-center justify-between px-4 py-4 bg-[#0a0a0a] hover:bg-[#111111] transition group"
            >
              <div>
                <p className="text-sm text-white">{snippet.title}</p>
                {snippet.description && (
                  <p className="text-xs text-[#666666] mt-0.5">{snippet.description}</p>
                )}
              </div>
              <span className="text-xs text-[#666666] group-hover:text-white transition shrink-0 ml-4">
                {snippet.language}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
