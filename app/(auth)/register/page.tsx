"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      setLoading(false);
      return;
    }

    router.push("/login");
  }

  const inputClass =
    "w-full px-3 py-2.5 bg-black border border-white/10 text-sm text-white placeholder-white/20 focus:border-white/25 transition outline-none font-mono";

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <nav className="px-8 py-5 border-b border-white/5">
        <Link href="/" className="text-xs font-bold tracking-[0.3em] text-white">
          VAULT
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <p className="text-[10px] tracking-[0.4em] text-white/40 mb-3">CREATE ACCOUNT</p>
            <h2 className="text-2xl font-mono text-white">Start your vault.</h2>
            <p className="text-xs text-white/50 mt-2">Free to use. No credit card required.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] tracking-widest text-white/50 mb-2">NAME</label>
              <input
                name="name"
                type="text"
                required
                placeholder="Kim"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-widest text-white/50 mb-2">EMAIL</label>
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-widest text-white/50 mb-2">PASSWORD</label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className={inputClass}
              />
            </div>

            {error && <p className="text-red-400 text-xs font-mono">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full text-sm text-black bg-white py-2.5 hover:bg-white/90 disabled:opacity-50 transition font-medium mt-2"
            >
              {loading ? "creating account..." : "create account"}
            </button>
          </form>

          <p className="text-xs text-white/40 mt-8 text-center">
            have an account?{" "}
            <Link href="/login" className="text-white/60 hover:text-white transition">
              sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
