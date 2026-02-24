import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { cliTokens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createHash, randomBytes } from "crypto";

// GET — list all tokens for the user
export async function GET() {
    const session = await auth();
    if (!session?.user?.id)
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const tokens = await db.query.cliTokens.findMany({
        where: eq(cliTokens.userId, session.user.id),
        columns: {
            id: true,
            name: true,
            createdAt: true,
            lastUsedAt: true,
            // never return the hashed token
        },
    });

    return NextResponse.json(tokens);
}

// POST — create a new token
export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id)
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { name } = await req.json();
    if (!name?.trim())
        return NextResponse.json(
            { message: "Token name is required" },
            { status: 400 },
        );

    // Generate a random token
    const raw = `vlt_${randomBytes(32).toString("hex")}`;
    const hashed = createHash("sha256").update(raw).digest("hex");

    await db.insert(cliTokens).values({
        userId: session.user.id,
        name: name.trim(),
        token: hashed,
    });

    // Return the raw token ONCE — never stored in plain text
    return NextResponse.json({ token: raw, name }, { status: 201 });
}

// DELETE — revoke a token by id
export async function DELETE(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id)
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();
    if (!id)
        return NextResponse.json(
            { message: "Token ID is required" },
            { status: 400 },
        );

    await db.delete(cliTokens).where(eq(cliTokens.id, id));

    return NextResponse.json({ success: true });
}
