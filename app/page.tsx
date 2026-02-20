import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center space-y-6">
        <h1 className="text-2xl font-bold tracking-widest uppercase">
          VAULT
        </h1>
        <p className="text-sm text-gray-500">
          Your personal code snippet vault
        </p>
        <div className="flex items-center gap-4 justify-center">
          <Link
            href="/login"
            className="text-sm text-white bg-black px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-sm text-gray-900 border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition"
          >
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}
