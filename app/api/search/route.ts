import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { snippets } from "@/lib/db/schema";
import { eq, and, or, ilike } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user)
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );

        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q") ?? "";

        if (!query.trim()) return NextResponse.json([]);

        const results = await db
            .select()
            .from(snippets)
            .where(
                and(
                    eq(snippets.userId, user.id),
                    or(
                        ilike(snippets.title, `%${query}%`),
                        ilike(snippets.description, `%${query}%`),
                        ilike(snippets.code, `%${query}%`),
                        ilike(snippets.language, `%${query}%`),
                    ),
                ),
            )
            .limit(20);

        return NextResponse.json(results);
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 },
        );
    }
}
