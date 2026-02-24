import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { snippets } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/auth-helpers";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user)
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );

        const { id } = await params;
        const [snippet] = await db
            .select()
            .from(snippets)
            .where(and(eq(snippets.id, id), eq(snippets.userId, user.id)))
            .limit(1);

        if (!snippet)
            return NextResponse.json({ message: "Not found" }, { status: 404 });

        return NextResponse.json(snippet);
    } catch (error) {
        console.error("Get snippet error:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 },
        );
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const user = await getAuthenticatedUser(req);
    if (!user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const [updated] = await db
        .update(snippets)
        .set({
            title: body.title,
            description: body.description,
            code: body.code,
            language: body.language,
        })
        .where(and(eq(snippets.id, id), eq(snippets.userId, user.id)))
        .returning();

    if (!updated)
        return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(updated);
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const user = await getAuthenticatedUser(req);
    if (!user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await db
        .delete(snippets)
        .where(and(eq(snippets.id, id), eq(snippets.userId, user.id)));

    return NextResponse.json({ success: true });
}
