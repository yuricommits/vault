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

  const inputClass = "w-full px-3 py-2 bg-black border border-white/10 text-sm text-white placeholder-white/30 focus:border-white/20 transition";

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <p className="text-xs text-white/40 mb-2">// VAULT</p>
          <h2 className="text-xl text-white font-bold">Create account.</h2>
          <p className="text-xs text-white/40 mt-1">Start building your vault.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-white/40 mb-2">name</label>
            <input
              name="name"
              type="text"
              required
              placeholder="Kim"
              className={inputClass}
            />
          </div>

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
            {loading ? "creating account..." : "create account"}
          </button>
        </form>

        <p className="text-xs text-white/40 mt-6 text-center">
          have an account?{" "}
          <Link href="/login" className="text-white hover:text-white/80 transition">
            sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
