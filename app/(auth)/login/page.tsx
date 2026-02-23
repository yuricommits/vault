"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
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
            <p className="text-[10px] tracking-[0.4em] text-white/40 mb-3">SIGN IN</p>
            <h2 className="text-2xl font-mono text-white">Welcome back.</h2>
            <p className="text-xs text-white/50 mt-2">Enter your credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
              {loading ? "signing in..." : "sign in"}
            </button>
          </form>

          <p className="text-xs text-white/40 mt-8 text-center">
            no account?{" "}
            <Link href="/register" className="text-white/60 hover:text-white transition">
              create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
