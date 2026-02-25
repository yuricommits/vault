import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import AdminFeedback from "@/components/admin/feedback-inbox";

export default async function AdminFeedbackPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    });

    if (!user?.isAdmin) redirect("/dashboard");

    return <AdminFeedback />;
}
