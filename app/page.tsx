import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="text-center space-y-6">
        <p className="text-xs text-white/40">// VAULT</p>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Your code vault.
        </h1>
        <p className="text-sm text-white/40">
          A minimal place for your code snippets.
        </p>
        <div className="flex items-center gap-4 justify-center pt-2">
          <Link
            href="/login"
            className="text-sm text-black bg-white px-5 py-2 hover:bg-white/90 transition font-medium"
          >
            sign in
          </Link>
          <Link
            href="/register"
            className="text-sm text-white/60 border border-white/10 px-5 py-2 hover:text-white hover:border-white/20 transition"
          >
            create account
          </Link>
        </div>
      </div>
    </main>
  );
}
