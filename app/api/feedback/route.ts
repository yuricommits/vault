import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { feedback } from "@/lib/db/schema";

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id)
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { type, message } = await req.json();

    if (!type || !message?.trim())
        return NextResponse.json(
            { message: "Type and message are required" },
            { status: 400 },
        );

    const [entry] = await db
        .insert(feedback)
        .values({
            userId: session.user.id,
            type,
            message: message.trim(),
        })
        .returning();

    return NextResponse.json(entry, { status: 201 });
}
