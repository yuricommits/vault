import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { feedback, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function requireAdmin() {
    const session = await auth();
    if (!session?.user?.id) return null;
    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    });
    if (!user?.isAdmin) return null;
    return user;
}

export async function GET() {
    const admin = await requireAdmin();
    if (!admin)
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const entries = await db.query.feedback.findMany({
        orderBy: (f, { desc }) => [desc(f.createdAt)],
        with: { user: { columns: { id: true, name: true, email: true } } },
    });

    return NextResponse.json(entries);
}

export async function PATCH(req: NextRequest) {
    const admin = await requireAdmin();
    if (!admin)
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id, reply, status } = await req.json();
    if (!id)
        return NextResponse.json({ message: "ID required" }, { status: 400 });

    const [updated] = await db
        .update(feedback)
        .set({
            reply,
            status: status ?? "replied",
            repliedAt: new Date(),
        })
        .where(eq(feedback.id, id))
        .returning();

    return NextResponse.json(updated);
}
