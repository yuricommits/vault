import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import SidebarNav from "@/components/sidebar-nav";
import KeyboardShortcuts from "@/components/keyboard-shortcuts";
import SearchPalette from "@/components/search-palette";
import { ToastProvider } from "@/components/toast";
import FeedbackWidget from "@/components/feedback-widget";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session?.user) redirect("/login");

    return (
        <ToastProvider>
            <div className="min-h-screen bg-bg flex flex-col">
                <div className="grid-bg" />
                <KeyboardShortcuts />
                <SearchPalette />
                <FeedbackWidget />

                {/* Top nav */}
                <nav className="relative z-10 border-b border-border px-[24px] flex items-center h-[56px] gap-[16px]">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-[7px] text-[13px] font-semibold text-text-1 tracking-[-0.3px] flex-shrink-0"
                    >
                        <span className="text-[16px] text-text-3">◈</span>
                        vault
                    </Link>
                </nav>

                <div className="relative z-10 flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <aside className="w-[192px] border-r border-border flex flex-col flex-shrink-0 pl-[8px] overflow-hidden">
                        <SidebarNav />
                    </aside>

                    {/* Main */}
                    <main className="flex-1 overflow-y-auto p-[24px]">
                        {children}
                    </main>
                </div>
            </div>
        </ToastProvider>
    );
}
