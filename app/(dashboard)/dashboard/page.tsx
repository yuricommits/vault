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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Snippets</h2>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back, {session?.user?.name}!
          </p>
        </div>
        <Link
          href="/dashboard/snippets/new"
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
        >
          + New Snippet
        </Link>
      </div>

      {userSnippets.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-4xl mb-4">🗄️</p>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No snippets yet
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Start building your Vault by adding your first code snippet.
          </p>
          <Link
            href="/dashboard/snippets/new"
            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
          >
            + New Snippet
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {userSnippets.map((snippet) => (
            <Link
              key={snippet.id}
              href={`/dashboard/snippets/${snippet.id}`}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-400 transition block"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{snippet.title}</h3>
                  {snippet.description && (
                    <p className="text-gray-500 text-sm mt-1">{snippet.description}</p>
                  )}
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-mono">
                  {snippet.language}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
