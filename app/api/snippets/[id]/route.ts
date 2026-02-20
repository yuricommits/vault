import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { snippets } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { title, description, code, language } = await req.json();

    if (!title || !code || !language) {
      return NextResponse.json(
        { message: "Title, code and language are required" },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(snippets)
      .set({
        title,
        description,
        code,
        language,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(snippets.id, id),
          eq(snippets.userId, session.user.id)
        )
      )
      .returning();

    if (!updated) {
      return NextResponse.json(
        { message: "Snippet not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update snippet error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    await db
      .delete(snippets)
      .where(
        and(
          eq(snippets.id, id),
          eq(snippets.userId, session.user.id)
        )
      );

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete snippet error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
