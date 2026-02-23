import { auth } from "@/auth";
import { db } from "@/lib/db";
import { snippets } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}

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
          <p className="text-[10px] tracking-widest text-white/40 mb-2">SNIPPETS</p>
          <h2 className="text-lg font-mono text-white">
            {userSnippets.length > 0
              ? `${userSnippets.length} snippet${userSnippets.length === 1 ? "" : "s"}`
              : "your vault"}
          </h2>
        </div>
        <Link
          href="/dashboard/snippets/new"
          className="text-xs text-black bg-white px-3 py-1.5 hover:bg-white/90 transition font-medium"
        >
          + new snippet
        </Link>
      </div>

      {userSnippets.length === 0 ? (
        <div className="mt-32 flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 border border-white/10 flex items-center justify-center text-white/40 text-xl">
            ⊞
          </div>
          <div>
            <p className="text-sm text-white/40 mb-1">your vault is empty</p>
            <p className="text-xs text-white/40">save your first snippet to get started</p>
          </div>
          <Link
            href="/dashboard/snippets/new"
            className="text-xs text-black bg-white px-4 py-2 hover:bg-white/90 transition font-medium mt-2"
          >
            + new snippet
          </Link>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-white/5">
          {userSnippets.map((snippet) => (
            <Link
              key={snippet.id}
              href={`/dashboard/snippets/${snippet.id}`}
              className="group flex items-center justify-between py-4 px-3 -mx-3 hover:bg-white/[0.02] transition-all duration-150"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-[10px] font-mono text-white/40 border border-white/10 px-1.5 py-0.5 shrink-0">
                  {snippet.language}
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-white/80 group-hover:text-white transition truncate">
                    {snippet.title}
                  </p>
                  {snippet.description && (
                    <p className="text-xs text-white/40 mt-0.5 truncate">{snippet.description}</p>
                  )}
                </div>
              </div>
              <span className="text-[10px] text-white/40 font-mono shrink-0 ml-6">
                {timeAgo(new Date(snippet.createdAt))}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
