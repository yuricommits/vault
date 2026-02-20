import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { snippets } from "@/lib/db/schema";
import { eq, and, or, ilike } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") ?? "";

    if (!query.trim()) {
      return NextResponse.json([]);
    }

    const results = await db
      .select()
      .from(snippets)
      .where(
        and(
          eq(snippets.userId, session.user.id),
          or(
            ilike(snippets.title, `%${query}%`),
            ilike(snippets.description, `%${query}%`),
            ilike(snippets.code, `%${query}%`),
            ilike(snippets.language, `%${query}%`)
          )
        )
      )
      .limit(20);

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
