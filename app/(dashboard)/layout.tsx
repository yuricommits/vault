import { auth } from "@/auth";
import { signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import SearchBar from "@/components/search-bar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-white">
            <nav className="border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                <Link
                    href="/dashboard"
                    className="text-sm font-bold tracking-widest text-gray-900"
                >
                    VAULT
                </Link>
                <div className="flex items-center gap-4">
                    <SearchBar />
                    <form
                        action={async () => {
                            "use server";
                            await signOut({ redirectTo: "/login" });
                        }}
                    >
                        <button
                            type="submit"
                            className="text-sm text-gray-400 hover:text-gray-900 transition"
                        >
                            Sign out
                        </button>
                    </form>
                </div>
            </nav>
            <main className="max-w-4xl mx-auto px-6 py-10">{children}</main>
        </div>
    );
}
