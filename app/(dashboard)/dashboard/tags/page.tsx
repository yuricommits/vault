import { auth } from "@/auth";
import { db } from "@/lib/db";
import { tags, snippetTags } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";

export default async function TagsPage() {
  const session = await auth();

  const allTags = await db
    .select({
      id: tags.id,
      name: tags.name,
      snippetCount: count(snippetTags.snippetId),
    })
    .from(tags)
    .leftJoin(snippetTags, eq(tags.id, snippetTags.tagId))
    .where(eq(tags.userId, session?.user?.id as string))
    .groupBy(tags.id, tags.name);

  return (
    <div>
      <div className="mb-10">
        <p className="text-[10px] tracking-widest text-white/40 mb-2">TAGS</p>
        <h2 className="text-lg font-mono text-white">
          {allTags.length > 0
            ? `${allTags.length} tag${allTags.length === 1 ? "" : "s"}`
            : "no tags yet"}
        </h2>
      </div>

      {allTags.length === 0 ? (
        <div className="mt-32 flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 border border-white/10 flex items-center justify-center text-white/40 text-xl">
            #
          </div>
          <div>
            <p className="text-sm text-white/40 mb-1">no tags yet</p>
            <p className="text-xs text-white/40">add tags to your snippets to organize them</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
          {allTags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center justify-between px-4 py-4 bg-black hover:bg-white/[0.02] transition-all duration-150 group"
            >
              <span className="text-sm font-mono text-white/80 group-hover:text-white transition">
                {tag.name}
              </span>
              <span className="text-[10px] text-white/40 font-mono">
                {tag.snippetCount} {tag.snippetCount === 1 ? "snippet" : "snippets"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
