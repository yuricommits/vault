import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tags } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user)
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );

        const userTags = await db
            .select()
            .from(tags)
            .where(eq(tags.userId, user.id));

        return NextResponse.json(userTags);
    } catch (error) {
        console.error("Get tags error:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 },
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user)
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );

        const { name } = await req.json();

        if (!name)
            return NextResponse.json(
                { message: "Tag name is required" },
                { status: 400 },
            );

        const [tag] = await db
            .insert(tags)
            .values({ name: name.toLowerCase().trim(), userId: user.id })
            .onConflictDoNothing()
            .returning();

        return NextResponse.json(tag, { status: 201 });
    } catch (error) {
        console.error("Create tag error:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 },
        );
    }
}
