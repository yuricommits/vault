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

  const inputClass = "w-full px-3 py-2 bg-black border border-white/10 text-sm text-white placeholder-white/30 focus:border-white/20 transition";

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <p className="text-xs text-white/40 mb-2">// VAULT</p>
          <h2 className="text-xl text-white font-bold">Sign in.</h2>
          <p className="text-xs text-white/40 mt-1">Welcome back.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-white/40 mb-2">email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-2">password</label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className={inputClass}
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full text-sm text-black bg-white py-2 hover:bg-white/90 disabled:opacity-50 transition font-medium"
          >
            {loading ? "signing in..." : "sign in"}
          </button>
        </form>

        <p className="text-xs text-white/40 mt-6 text-center">
          no account?{" "}
          <Link href="/register" className="text-white hover:text-white/80 transition">
            create one
          </Link>
        </p>
      </div>
    </div>
  );
}
