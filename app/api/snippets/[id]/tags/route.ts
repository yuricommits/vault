import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { snippets } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );
        }
        const { id } = await params;
        const [snippet] = await db
            .select()
            .from(snippets)
            .where(
                and(eq(snippets.id, id), eq(snippets.userId, session.user.id)),
            )
            .limit(1);
        if (!snippet) {
            return NextResponse.json({ message: "Not found" }, { status: 404 });
        }
        return NextResponse.json(snippet);
    } catch (error) {
        console.error("Get snippet error:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 },
        );
    }
}

// ... rest of the file unchanged (PATCH and DELETE stay as they are)

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const session = await auth();
    if (!session?.user?.id)
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
        .where(and(eq(snippets.id, id), eq(snippets.userId, session.user.id)))
        .returning();
    if (!updated)
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
}

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const session = await auth();
    if (!session?.user?.id)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    await db
        .delete(snippets)
        .where(and(eq(snippets.id, id), eq(snippets.userId, session.user.id)));
    return NextResponse.json({ success: true });
}
