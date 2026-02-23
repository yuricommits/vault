import { auth } from "@/auth";
import { signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import SearchBar from "@/components/search-bar";
import SidebarNav from "@/components/sidebar-nav";
import KeyboardShortcuts from "@/components/keyboard-shortcuts";
import { ToastProvider } from "@/components/toast";

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
    <ToastProvider>
      <div className="min-h-screen bg-black flex flex-col">
        <KeyboardShortcuts />
        <nav className="border-b border-white/5 px-6 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="text-xs font-bold tracking-[0.3em] text-white">
            VAULT
          </Link>
          <div className="flex items-center gap-4">
            <SearchBar />
            <form action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}>
              <button type="submit" className="text-xs text-white/30 hover:text-white transition">
                sign out
              </button>
            </form>
          </div>
        </nav>

        <div className="flex flex-1">
          <aside className="w-48 border-r border-white/5 flex flex-col">
            <SidebarNav />
          </aside>

          <main className="flex-1 px-8 py-8 max-w-4xl">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
