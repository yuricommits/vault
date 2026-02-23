"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
    { label: "Features", href: "features" },
    { label: "How it works", href: "how" },
];

function smoothScrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top, behavior: "smooth" });
}

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", fn);
        return () => window.removeEventListener("scroll", fn);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-[0.35s] ease-out border-b border-transparent ${scrolled ? "bg-bg/90 backdrop-blur-[14px] !border-border" : ""}`}
        >
            <div className="container flex items-center h-[56px]">
                <Link
                    href="/"
                    className="flex flex-shrink-0 items-center gap-[7px] text-[13px] font-semibold text-text-1 tracking-[-0.3px] mr-8"
                >
                    <span className="text-[16px] text-text-3">◈</span>
                    vault
                </Link>

                <nav className="hidden md:flex flex-1 items-center gap-[2px]">
                    {NAV_LINKS.map((l) => (
                        <button
                            key={l.label}
                            onClick={() => smoothScrollTo(l.href)}
                            className="font-mono px-[10px] py-[5px] text-[12.5px] text-text-3 rounded-xs transition-colors duration-[0.18s] hover:text-text-1 hover:bg-bg-2 bg-transparent border-none cursor-pointer"
                        >
                            {l.label}
                        </button>
                    ))}
                </nav>

                <div className="hidden md:flex flex-shrink-0 items-center gap-2">
                    <Link
                        href="/login"
                        className="btn btn-outline text-[12px] px-3 py-1.5"
                    >
                        Sign in
                    </Link>
                    <Link href="/register" className="btn btn-solid">
                        Get started
                    </Link>
                </div>

                <button
                    className="block md:hidden ml-auto p-[5px] text-text-3 bg-transparent border-none cursor-pointer"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <X size={18} /> : <Menu size={18} />}
                </button>
            </div>

            {open && (
                <div className="md:hidden flex flex-col gap-[2px] px-4 pt-2.5 pb-[18px] bg-bg border-t border-border">
                    {NAV_LINKS.map((l) => (
                        <button
                            key={l.label}
                            onClick={() => {
                                smoothScrollTo(l.href);
                                setOpen(false);
                            }}
                            className="font-mono px-2.5 py-[9px] text-[13px] text-text-2 hover:text-text-1 bg-transparent border-none cursor-pointer text-left"
                        >
                            {l.label}
                        </button>
                    ))}
                    <div className="h-px bg-border my-2" />
                    <Link
                        href="/register"
                        className="btn btn-solid !justify-center"
                    >
                        Get started →
                    </Link>
                </div>
            )}
        </header>
    );
}
