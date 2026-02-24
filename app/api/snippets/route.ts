import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { snippets } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/auth-helpers";

export async function POST(req: NextRequest) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user)
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );

        const { title, description, code, language } = await req.json();

        if (!title || !code || !language) {
            return NextResponse.json(
                { message: "Title, code and language are required" },
                { status: 400 },
            );
        }

        const [snippet] = await db
            .insert(snippets)
            .values({ userId: user.id, title, description, code, language })
            .returning();

        return NextResponse.json(snippet, { status: 201 });
    } catch (error) {
        console.error("Create snippet error:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 },
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user)
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );

        const userSnippets = await db
            .select()
            .from(snippets)
            .where(eq(snippets.userId, user.id))
            .orderBy(desc(snippets.createdAt));

        return NextResponse.json(userSnippets);
    } catch (error) {
        console.error("Get snippets error:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 },
        );
    }
}
