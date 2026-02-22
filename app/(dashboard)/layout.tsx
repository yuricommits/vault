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
    <div className="min-h-screen bg-black flex flex-col">
      <nav className="border-b border-[#222222] px-6 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="text-sm font-bold tracking-widest text-white">
          VAULT
        </Link>
        <div className="flex items-center gap-4">
          <SearchBar />
          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}>
            <button type="submit" className="text-xs text-[#888888] hover:text-white transition">
              sign out
            </button>
          </form>
        </div>
      </nav>

      <div className="flex flex-1">
        <aside className="w-52 border-r border-[#222222] flex flex-col justify-between py-6 px-3">
          <nav className="flex flex-col gap-1">
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-xs text-[#888888] hover:text-white hover:bg-[#111111] rounded transition">
              <span>⊞</span>
              <span>snippets</span>
            </Link>
            <Link href="/dashboard/tags" className="flex items-center gap-3 px-3 py-2 text-xs text-[#888888] hover:text-white hover:bg-[#111111] rounded transition">
              <span>#</span>
              <span>tags</span>
            </Link>
          </nav>

          <div className="flex flex-col gap-1">
            <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 text-xs text-[#888888] hover:text-white hover:bg-[#111111] rounded transition">
              <span>⚙</span>
              <span>settings</span>
            </Link>
            <Link href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2 text-xs text-[#888888] hover:text-white hover:bg-[#111111] rounded transition">
              <span>◯</span>
              <span>profile</span>
            </Link>
          </div>
        </aside>

        <main className="flex-1 px-8 py-8 max-w-4xl">
          {children}
        </main>
      </div>
    </div>
  );
}
