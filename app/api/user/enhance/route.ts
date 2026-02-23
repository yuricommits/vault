import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    });

    if (!user?.anthropicKey) {
        return NextResponse.json(
            { error: "No Anthropic API key found. Add your key in Settings." },
            { status: 400 },
        );
    }

    const { code, language } = await req.json();
    if (!code)
        return NextResponse.json(
            { error: "No code provided" },
            { status: 400 },
        );

    const client = new Anthropic({ apiKey: user.anthropicKey });

    const message = await client.messages.create({
        model: "claude-opus-4-6",
        max_tokens: 1024,
        messages: [
            {
                role: "user",
                content: `You are a code analysis assistant. Analyze this ${language || "code"} snippet and return a JSON object with these fields:
- title: a short, descriptive title (max 60 chars)
- description: a one-sentence description of what it does (max 120 chars)
- tags: array of 2-5 relevant tags (lowercase, no spaces)
- improvedCode: a cleaned up version of the code with proper types, comments, and formatting
- language: the detected programming language

Return ONLY valid JSON, no markdown, no explanation.

Code:
${code}`,
            },
        ],
    });

    const text =
        message.content[0].type === "text" ? message.content[0].text : "";

    try {
        const result = JSON.parse(text);
        return NextResponse.json(result);
    } catch {
        return NextResponse.json(
            { error: "Failed to parse AI response" },
            { status: 500 },
        );
    }
}
