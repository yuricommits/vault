import { auth } from "@/auth";
import { db } from "@/lib/db";
import { cliTokens, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createHash } from "crypto";
import { NextRequest } from "next/server";

export async function getAuthenticatedUser(req: NextRequest) {
    // Try Bearer token first (CLI)
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
        const raw = authHeader.slice(7);
        const hashed = createHash("sha256").update(raw).digest("hex");
        const token = await db.query.cliTokens.findFirst({
            where: eq(cliTokens.token, hashed),
        });
        if (!token) return null;

        // Update lastUsedAt
        await db
            .update(cliTokens)
            .set({ lastUsedAt: new Date() })
            .where(eq(cliTokens.id, token.id));

        const user = await db.query.users.findFirst({
            where: eq(users.id, token.userId),
        });
        return user ?? null;
    }

    // Fall back to session (web app)
    const session = await auth();
    if (!session?.user?.id) return null;
    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    });
    return user ?? null;
}
