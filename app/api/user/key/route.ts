import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { key } = await req.json();
    if (!key || !key.startsWith("sk-ant-")) {
        return NextResponse.json(
            { error: "Invalid Anthropic API key" },
            { status: 400 },
        );
    }

    await db
        .update(users)
        .set({ anthropicKey: key })
        .where(eq(users.id, session.user.id));

    const masked = `sk-ant-••••••••••••${key.slice(-4)}`;
    return NextResponse.json({ masked });
}

export async function DELETE() {
    const session = await auth();
    if (!session?.user?.id)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await db
        .update(users)
        .set({ anthropicKey: null })
        .where(eq(users.id, session.user.id));

    return NextResponse.json({ success: true });
}

export async function GET() {
    const session = await auth();
    if (!session?.user?.id)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    });

    if (!user?.anthropicKey) return NextResponse.json({ masked: null });

    const masked = `sk-ant-••••••••••••${user.anthropicKey.slice(-4)}`;
    return NextResponse.json({ masked });
}
