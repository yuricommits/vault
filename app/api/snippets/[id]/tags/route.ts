import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { tags, snippetTags } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
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

    const snippetTagList = await db
      .select({ id: tags.id, name: tags.name })
      .from(snippetTags)
      .innerJoin(tags, eq(snippetTags.tagId, tags.id))
      .where(eq(snippetTags.snippetId, id));

    return NextResponse.json(snippetTagList);
  } catch (error) {
    console.error("Get snippet tags error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(
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
    const { tagId } = await req.json();

    await db
      .insert(snippetTags)
      .values({ snippetId: id, tagId })
      .onConflictDoNothing();

    return NextResponse.json({ message: "Tag added" }, { status: 201 });
  } catch (error) {
    console.error("Add tag error:", error);
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
    const { tagId } = await req.json();

    await db
      .delete(snippetTags)
      .where(
        and(
          eq(snippetTags.snippetId, id),
          eq(snippetTags.tagId, tagId)
        )
      );

    return NextResponse.json({ message: "Tag removed" });
  } catch (error) {
    console.error("Remove tag error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
