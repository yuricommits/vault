"use client";
import { motion } from "framer-motion";
import { ArrowRight, Github } from "lucide-react";
import Link from "next/link";

const LINES = [
    { tokens: [{ text: "// Enhance a snippet with AI", color: "#52525b" }] },
    {
        tokens: [
            { text: "const ", color: "#c4b5fd" },
            { text: "result", color: "#e2e8f0" },
            { text: " = ", color: "#94a3b8" },
            { text: "await ", color: "#c4b5fd" },
            { text: "vault", color: "#7dd3fc" },
            { text: ".enhance({", color: "#e2e8f0" },
        ],
    },
    {
        tokens: [
            { text: "  code: ", color: "#94a3b8" },
            { text: "`export function useDebounce", color: "#86efac" },
            { text: "<T>(", color: "#fbbf24" },
        ],
    },
    {
        tokens: [
            { text: "  value: ", color: "#94a3b8" },
            { text: "T,", color: "#e2e8f0" },
        ],
    },
    {
        tokens: [
            { text: "  delay: ", color: "#94a3b8" },
            { text: "number", color: "#c4b5fd" },
        ],
    },
    {
        tokens: [
            { text: "): ", color: "#94a3b8" },
            { text: "T ", color: "#fbbf24" },
            { text: "{", color: "#e2e8f0" },
        ],
    },
    {
        tokens: [
            { text: "  const ", color: "#c4b5fd" },
            { text: "[debounced, setDebounced]", color: "#e2e8f0" },
            { text: " = ", color: "#94a3b8" },
            { text: "useState", color: "#7dd3fc" },
            { text: "(value)", color: "#e2e8f0" },
        ],
    },
    {
        tokens: [
            { text: "  useEffect", color: "#7dd3fc" },
            { text: "(() => {", color: "#e2e8f0" },
        ],
    },
    {
        tokens: [
            { text: "    const ", color: "#c4b5fd" },
            { text: "t ", color: "#e2e8f0" },
            { text: "= ", color: "#94a3b8" },
            { text: "setTimeout", color: "#7dd3fc" },
            { text: "(() => ", color: "#e2e8f0" },
            { text: "setDebounced", color: "#7dd3fc" },
            { text: "(value), delay)", color: "#e2e8f0" },
        ],
    },
    {
        tokens: [
            { text: "    return ", color: "#c4b5fd" },
            { text: "() => ", color: "#e2e8f0" },
            { text: "clearTimeout", color: "#7dd3fc" },
            { text: "(t)", color: "#e2e8f0" },
        ],
    },
    { tokens: [{ text: "  }, [value, delay])", color: "#e2e8f0" }] },
    {
        tokens: [
            { text: "  return ", color: "#c4b5fd" },
            { text: "debounced", color: "#e2e8f0" },
        ],
    },
    { tokens: [{ text: "}`, ", color: "#e2e8f0" }] },
    { tokens: [] },
    { tokens: [{ text: "// → {", color: "#52525b" }] },
    {
        tokens: [
            { text: "//   title: ", color: "#52525b" },
            { text: '"useDebounce Hook"', color: "#86efac" },
            { text: ",", color: "#52525b" },
        ],
    },
    {
        tokens: [
            { text: "//   tags: ", color: "#52525b" },
            { text: '["react", "hooks", "typescript"]', color: "#86efac" },
        ],
    },
    { tokens: [{ text: "// }", color: "#52525b" }] },
];

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

export default function Hero() {
    return (
        <section className="min-h-screen flex items-center pt-[100px] pb-[80px] max-[900px]:pt-[110px] max-[900px]:pb-[64px]">
            <div className="container grid grid-cols-[1fr_1.15fr] gap-[64px] items-center max-[900px]:grid-cols-1">
                {/* Left */}
                <motion.div
                    className="flex flex-col gap-0"
                    variants={stagger}
                    initial="hidden"
                    animate="show"
                >
                    <motion.div
                        variants={fade}
                        className="flex items-center gap-2 mb-[28px]"
                    >
                        <span className="tag green">
                            <span className="dot" />
                            live
                        </span>
                        <span className="tag">v0.1.0-beta</span>
                        <span className="tag">open source</span>
                    </motion.div>

                    <motion.h1
                        variants={fade}
                        className="text-[clamp(30px,3.8vw,52px)] font-semibold tracking-[-0.045em] leading-[1.08] text-text-1 mb-[20px]"
                    >
                        A better place
                        <br />
                        for your snippets.
                    </motion.h1>

                    <motion.p
                        variants={fade}
                        className="text-[13.5px] text-text-2 leading-[1.8] max-w-[430px] mb-[20px]"
                    >
                        Vault is a personal, web-based code snippet manager.
                        Save code with titles, tags, and descriptions — then
                        enhance them with AI. Find anything instantly with
                        full-text search.
                    </motion.p>

                    <motion.p
                        variants={fade}
                        className="text-[11.5px] text-text-4 leading-[1.7] px-[14px] py-[10px] border border-border rounded-sm bg-bg-1 mb-[28px] max-w-[430px]"
                    >
                        <span className="text-text-3 font-semibold">Note</span>{" "}
                        Vault is in active development. Current features include
                        snippet CRUD, tagging, full-text search, syntax
                        highlighting, and AI enhancement.
                    </motion.p>

                    <motion.div
                        variants={fade}
                        className="flex gap-[10px] flex-wrap mb-[32px]"
                    >
                        <Link href="/register" className="btn btn-solid">
                            Open Vault <ArrowRight size={13} />
                        </Link>
                        <a
                            href="https://github.com/yuricommits/vault"
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-outline"
                        >
                            <Github size={13} />
                            GitHub
                        </a>
                        <Link href="/login" className="btn btn-outline">
                            Sign in
                        </Link>
                    </motion.div>

                    <motion.div
                        variants={fade}
                        className="flex items-center gap-[12px] pt-[24px] border-t border-border"
                    >
                        <span className="flex items-center gap-[6px] text-[11px]">
                            <span className="text-text-4">framework</span>
                            <span className="text-text-2">Next.js</span>
                        </span>
                        <span className="w-px h-[12px] bg-border-2" />
                        <span className="flex items-center gap-[6px] text-[11px]">
                            <span className="text-text-4">deploy</span>
                            <span className="text-text-2">Vercel</span>
                        </span>
                        <span className="w-px h-[12px] bg-border-2" />
                        <span className="flex items-center gap-[6px] text-[11px]">
                            <span className="text-text-4">ai</span>
                            <span className="text-text-2">Claude</span>
                        </span>
                    </motion.div>
                </motion.div>

                {/* Right: code panel */}
                <motion.div
                    className="bg-bg-1 border border-border-2 rounded-lg overflow-hidden"
                    style={{
                        boxShadow:
                            "0 0 0 1px rgba(255,255,255,0.05), 0 32px 64px rgba(0,0,0,0.6), 0 0 80px rgba(74,222,128,0.03)",
                    }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.55, delay: 0.2, ease: "easeOut" }}
                >
                    {/* Panel header */}
                    <div className="flex items-center gap-[10px] px-[16px] py-[11px] border-b border-border bg-bg-2">
                        <div className="flex gap-[5px]">
                            <span
                                className="w-[10px] h-[10px] rounded-full"
                                style={{ background: "#ff5f57" }}
                            />
                            <span
                                className="w-[10px] h-[10px] rounded-full"
                                style={{ background: "#febc2e" }}
                            />
                            <span
                                className="w-[10px] h-[10px] rounded-full"
                                style={{ background: "#28c840" }}
                            />
                        </div>
                        <span className="text-[11.5px] text-text-3 flex-1">
                            vault.ts
                        </span>
                        <span className="text-[10.5px] text-text-4 px-[7px] py-[2px] border border-border rounded-xs">
                            TypeScript
                        </span>
                    </div>

                    {/* Line numbers + code */}
                    <div className="flex overflow-auto max-h-[370px]">
                        <div
                            className="flex flex-col py-[14px] pl-[14px] pr-[12px] text-text-4 text-[11.5px] leading-[1.7] select-none border-r border-border min-w-[38px] text-right flex-shrink-0"
                            aria-hidden
                        >
                            {LINES.map((_, i) => (
                                <span key={i}>{i + 1}</span>
                            ))}
                        </div>
                        <pre className="px-[20px] py-[14px] text-[11.5px] leading-[1.7] whitespace-pre overflow-auto flex-1 m-0">
                            {LINES.map((line, i) => (
                                <div key={i}>
                                    {line.tokens.length === 0
                                        ? "\n"
                                        : line.tokens.map((token, j) => (
                                              <span
                                                  key={j}
                                                  style={{ color: token.color }}
                                              >
                                                  {token.text}
                                              </span>
                                          ))}
                                </div>
                            ))}
                        </pre>
                    </div>

                    {/* Status bar */}
                    <div className="flex items-center gap-[16px] px-[16px] py-[6px] border-t border-border bg-bg-2 text-[10.5px] text-text-4">
                        <span>UTF-8</span>
                        <span>TypeScript</span>
                        <span className="ml-auto">Ln 24, Col 1</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
