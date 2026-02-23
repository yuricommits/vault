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
            setError("Invalid email or password.");
            setLoading(false);
            return;
        }

        window.location.href = "/dashboard";
    }

    return (
        <div className="min-h-screen bg-bg flex flex-col">
            <div className="grid-bg" />

            {/* Navbar */}
            <header className="relative z-10 border-b border-border px-[24px] flex items-center h-[56px]">
                <Link
                    href="/"
                    className="flex items-center gap-[7px] text-[13px] font-semibold text-text-1 tracking-[-0.3px]"
                >
                    <span className="text-[16px] text-text-3">◈</span>
                    vault
                </Link>
                <div className="ml-auto flex items-center gap-[8px]">
                    <span className="text-[11.5px] text-text-4 font-mono">
                        no account?
                    </span>
                    <Link
                        href="/register"
                        className="btn btn-outline text-[12px] px-[12px] py-[6px]"
                    >
                        Create one
                    </Link>
                </div>
            </header>

            {/* Form */}
            <div className="relative z-10 flex-1 flex items-center justify-center px-[24px]">
                <div className="w-full max-w-[360px]">
                    <div className="mb-[36px]">
                        <span className="label mb-[16px] block">
                            {"// sign in"}
                        </span>
                        <h1 className="text-[clamp(22px,3vw,30px)] font-semibold tracking-[-0.04em] text-text-1 mb-[8px]">
                            Welcome back.
                        </h1>
                        <p className="text-[12.5px] text-text-3 leading-[1.7]">
                            Enter your credentials to access your vault.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-[16px]"
                    >
                        <div className="flex flex-col gap-[6px]">
                            <label className="text-[10px] tracking-widest text-text-4 font-mono uppercase">
                                Email
                            </label>
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="you@example.com"
                                className="w-full px-[12px] py-[10px] bg-bg-1 border border-border text-[13px] text-text-1 placeholder:text-text-4 focus:border-border-3 transition-colors duration-[0.18s] font-mono rounded-sm"
                            />
                        </div>

                        <div className="flex flex-col gap-[6px]">
                            <label className="text-[10px] tracking-widest text-text-4 font-mono uppercase">
                                Password
                            </label>
                            <input
                                name="password"
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full px-[12px] py-[10px] bg-bg-1 border border-border text-[13px] text-text-1 placeholder:text-text-4 focus:border-border-3 transition-colors duration-[0.18s] font-mono rounded-sm"
                            />
                        </div>

                        {error && (
                            <p className="text-[11.5px] text-red-400 font-mono px-[12px] py-[8px] border border-red-400/20 bg-red-400/5 rounded-sm">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-solid w-full justify-center mt-[4px] py-[10px] disabled:opacity-50"
                        >
                            {loading ? "signing in..." : "sign in →"}
                        </button>
                    </form>

                    <div className="mt-[24px] pt-[24px] border-t border-border flex items-center justify-between">
                        <span className="text-[11px] text-text-4 font-mono">
                            vault · private by default
                        </span>
                        <Link
                            href="/register"
                            className="text-[11.5px] text-text-3 hover:text-text-1 transition-colors font-mono"
                        >
                            create account →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
