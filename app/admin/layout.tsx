import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    });

    if (!user?.isAdmin) redirect("/dashboard");

    return (
        <div className="min-h-screen bg-bg text-text-1 font-mono flex flex-col">
            <div className="grid-bg" />
            <nav className="relative z-10 border-b border-border px-[24px] flex items-center h-[56px] gap-[16px]">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-[7px] text-[13px] font-semibold text-text-1 tracking-[-0.3px]"
                >
                    <span className="text-[16px] text-text-3">◈</span>
                    vault
                </Link>
                <span className="text-text-4 text-[12px]">/</span>
                <span className="text-[12px] text-text-3">admin</span>
                <div className="ml-auto flex items-center gap-[16px]">
                    <Link
                        href="/admin/feedback"
                        className="text-[11.5px] text-text-4 hover:text-text-1 transition-colors"
                    >
                        feedback
                    </Link>
                    <form
                        action={async () => {
                            "use server";
                            await signOut({ redirectTo: "/login" });
                        }}
                    >
                        <button
                            type="submit"
                            className="text-[11.5px] text-text-4 hover:text-text-1 transition-colors"
                        >
                            sign out
                        </button>
                    </form>
                </div>
            </nav>
            <main className="relative z-10 flex-1 overflow-hidden p-[24px]">
                {children}
            </main>
        </div>
    );
}
