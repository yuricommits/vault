import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { aiUsage } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

const client = new Anthropic();
const DAILY_LIMIT = 10;

function today() {
  return new Date().toISOString().slice(0, 10);
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const date = today();

    // Check usage
    const [usage] = await db
      .select()
      .from(aiUsage)
      .where(and(eq(aiUsage.userId, userId), eq(aiUsage.date, date)))
      .limit(1);

    const currentCount = usage?.count ?? 0;

    if (currentCount >= DAILY_LIMIT) {
      return NextResponse.json(
        { error: "Daily limit reached. You can enhance up to 10 snippets per day." },
        { status: 429 }
      );
    }

    const { code, language } = await req.json();

    if (!code || code.trim().length === 0) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are a code analysis assistant. Analyze the following code and return a JSON object with these exact fields:
- title: a short, smart title for this snippet (max 6 words)
- description: a concise one-sentence description of what it does
- improvedCode: the same code with minor quality improvements (better naming, formatting, remove redundancy) — preserve behavior exactly
- tags: an array of 2-5 relevant lowercase tag strings (e.g. ["typescript", "array", "utility"])
- language: the detected programming language as a lowercase string

Return ONLY valid JSON. No markdown, no explanation, no code fences.

Language hint: ${language || "unknown"}

Code:
${code}`,
        },
      ],
    });

    // Increment usage
    if (usage) {
      await db
        .update(aiUsage)
        .set({ count: currentCount + 1 })
        .where(and(eq(aiUsage.userId, userId), eq(aiUsage.date, date)));
    } else {
      await db.insert(aiUsage).values({ userId, date, count: 1 });
    }

    const raw = message.content[0];
    if (raw.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    const parsed = JSON.parse(raw.text);
    return NextResponse.json({ ...parsed, remaining: DAILY_LIMIT - (currentCount + 1) });
  } catch (err) {
    console.error("AI enhance error:", err);
    return NextResponse.json(
      { error: "Enhancement failed. You can fill in the details manually." },
      { status: 500 }
    );
  }
}
