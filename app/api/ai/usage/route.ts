import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { aiUsage } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

const DAILY_LIMIT = 10;

function today() {
  return new Date().toISOString().slice(0, 10);
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [usage] = await db
    .select()
    .from(aiUsage)
    .where(and(eq(aiUsage.userId, session.user.id), eq(aiUsage.date, today())))
    .limit(1);

  const count = usage?.count ?? 0;
  return NextResponse.json({ count, limit: DAILY_LIMIT, remaining: DAILY_LIMIT - count });
}
