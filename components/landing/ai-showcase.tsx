"use client";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const BEFORE = `// raw paste — no context
function d(v, ms) {
  let t
  return function(...a) {
    clearTimeout(t)
    t = setTimeout(() => {
      fn.apply(this, a)
    }, ms)
  }
}`;

const AFTER_LINES = [
    { tokens: [{ text: "/**", color: "#52525b" }] },
    {
        tokens: [
            { text: " * useDebounce — delays invoking fn", color: "#52525b" },
        ],
    },
    {
        tokens: [
            {
                text: " * until after `delay` ms have elapsed.",
                color: "#52525b",
            },
        ],
    },
    { tokens: [{ text: " */", color: "#52525b" }] },
    { tokens: [] },
    {
        tokens: [
            { text: "export function ", color: "#c4b5fd" },
            { text: "useDebounce", color: "#7dd3fc" },
            { text: "<", color: "#e2e8f0" },
            { text: "T", color: "#fbbf24" },
            { text: ">(", color: "#e2e8f0" },
        ],
    },
    {
        tokens: [
            { text: "  value: ", color: "#94a3b8" },
            { text: "T", color: "#fbbf24" },
            { text: ", delay: ", color: "#94a3b8" },
            { text: "number", color: "#c4b5fd" },
        ],
    },
    {
        tokens: [
            { text: "): ", color: "#94a3b8" },
            { text: "T", color: "#fbbf24" },
            { text: " {", color: "#e2e8f0" },
        ],
    },
    {
        tokens: [
            { text: "  const ", color: "#c4b5fd" },
            { text: "[debounced, set]", color: "#e2e8f0" },
            { text: " = ", color: "#94a3b8" },
            { text: "useState", color: "#7dd3fc" },
            { text: "<", color: "#e2e8f0" },
            { text: "T", color: "#fbbf24" },
            { text: ">(value)", color: "#e2e8f0" },
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
            { text: "    const t = ", color: "#e2e8f0" },
            { text: "setTimeout", color: "#7dd3fc" },
            { text: "(() => ", color: "#e2e8f0" },
            { text: "set", color: "#7dd3fc" },
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
    { tokens: [{ text: "}", color: "#e2e8f0" }] },
];

const METADATA = {
    title: "useDebounce",
    description:
        "Delays invoking a function until after delay ms have elapsed. Automatically cleans up on unmount.",
    tags: ["react", "hooks", "typescript", "util"],
    language: "typescript",
};

export default function AIShowcase() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });
    const [enhanced, setEnhanced] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleEnhance = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setEnhanced(true);
        }, 2000);
    };

    return (
        <section
            className="py-[100px] border-t border-border"
            id="ai"
            ref={ref}
        >
            <div className="container">
                <motion.div
                    className="mb-[64px] flex flex-col gap-[14px]"
                    initial={{ opacity: 0, y: 16 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4 }}
                >
                    <span className="label">// ai enhancement</span>
                    <h2 className="heading mt-[10px]">
                        Paste raw code.
                        <br />
                        Claude does the rest.
                    </h2>
                    <p className="subtext">
                        Drop in any snippet — no title, no description, no tags.
                        Hit enhance and Claude generates everything
                        automatically.
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-2 max-[820px]:grid-cols-1 gap-[20px] items-stretch mb-[32px]"
                    initial={{ opacity: 0, y: 16 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.15 }}
                >
                    {/* Before */}
                    <div className="flex flex-col rounded-lg overflow-hidden border border-white/[0.04] bg-[#0a0a0c]">
                        <div className="flex items-center justify-between px-[16px] py-[11px] border-b border-white/[0.04]">
                            <div className="flex items-center gap-[10px]">
                                <span className="flex gap-[5px]">
                                    <span className="w-[9px] h-[9px] rounded-full bg-white/10" />
                                    <span className="w-[9px] h-[9px] rounded-full bg-white/10" />
                                    <span className="w-[9px] h-[9px] rounded-full bg-white/10" />
                                </span>
                                <span className="text-[11px] font-mono text-white/20">
                                    before.js
                                </span>
                            </div>
                            <span className="text-[9.5px] px-[7px] py-[2px] rounded-xs font-mono border border-white/[0.06] text-white/20">
                                raw
                            </span>
                        </div>
                        <pre className="flex-1 px-[20px] py-[20px] text-[11.5px] leading-[1.85] text-white/20 whitespace-pre overflow-auto font-mono m-0">
                            {BEFORE}
                        </pre>
                        <div className="px-[16px] py-[10px] border-t border-white/[0.04] flex items-center gap-[8px]">
                            <span className="text-[10px] font-mono text-white/15">
                                no title · no tags · no description
                            </span>
                        </div>
                    </div>

                    {/* After */}
                    <AnimatePresence mode="wait">
                        {!enhanced ? (
                            <motion.div
                                key="waiting"
                                className="flex flex-col rounded-lg overflow-hidden border border-border bg-bg-1"
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex items-center justify-between px-[16px] py-[11px] border-b border-border bg-bg-2">
                                    <div className="flex items-center gap-[10px]">
                                        <span className="flex gap-[5px]">
                                            <span className="w-[9px] h-[9px] rounded-full bg-bg-3" />
                                            <span className="w-[9px] h-[9px] rounded-full bg-bg-3" />
                                            <span className="w-[9px] h-[9px] rounded-full bg-bg-3" />
                                        </span>
                                        <span className="text-[11px] font-mono text-text-4">
                                            after.ts
                                        </span>
                                    </div>
                                    <span className="text-[9.5px] px-[7px] py-[2px] rounded-xs font-mono border border-border text-text-4">
                                        waiting
                                    </span>
                                </div>
                                <div className="flex-1 flex flex-col items-center justify-center gap-[14px] py-[64px] bg-bg-1">
                                    {loading ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{
                                                    duration: 1.2,
                                                    repeat: Infinity,
                                                    ease: "linear",
                                                }}
                                                className="text-green"
                                            >
                                                <Sparkles size={22} />
                                            </motion.div>
                                            <div className="flex flex-col items-center gap-[4px]">
                                                <span className="text-[12px] text-text-2 font-mono">
                                                    Claude is enhancing...
                                                </span>
                                                <span className="text-[10.5px] text-text-4 font-mono">
                                                    generating title · tags ·
                                                    improved code
                                                </span>
                                            </div>
                                            <div className="w-[160px] h-[2px] bg-bg-3 rounded-full overflow-hidden mt-[4px]">
                                                <motion.div
                                                    className="h-full bg-green rounded-full"
                                                    initial={{ width: "0%" }}
                                                    animate={{ width: "100%" }}
                                                    transition={{
                                                        duration: 2,
                                                        ease: "easeInOut",
                                                    }}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-[44px] h-[44px] border border-border-2 rounded-md flex items-center justify-center text-text-4 bg-bg-2">
                                                <Sparkles size={18} />
                                            </div>
                                            <span className="text-[12px] text-text-4 font-mono">
                                                hit enhance to see the result
                                            </span>
                                        </>
                                    )}
                                </div>
                                <div className="px-[16px] py-[10px] border-t border-border bg-bg-2 flex items-center gap-[8px]">
                                    <span className="text-[10px] font-mono text-text-4">
                                        ready to enhance
                                    </span>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="enhanced"
                                className="flex flex-col rounded-lg overflow-hidden"
                                style={{
                                    border: "1px solid rgba(255,255,255,0.12)",
                                    boxShadow:
                                        "0 0 0 1px rgba(255,255,255,0.03), 0 0 40px rgba(255,255,255,0.04)",
                                    background: "#111113",
                                }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.45, ease: "easeOut" }}
                            >
                                <div
                                    className="flex items-center justify-between px-[16px] py-[11px] border-b"
                                    style={{
                                        borderColor: "rgba(255,255,255,0.07)",
                                        background: "#0f0f11",
                                    }}
                                >
                                    <div className="flex items-center gap-[10px]">
                                        <span className="flex gap-[5px]">
                                            <span
                                                className="w-[9px] h-[9px] rounded-full"
                                                style={{
                                                    background: "#28c840",
                                                    boxShadow:
                                                        "0 0 6px #28c840",
                                                }}
                                            />
                                            <span className="w-[9px] h-[9px] rounded-full bg-white/10" />
                                            <span className="w-[9px] h-[9px] rounded-full bg-white/10" />
                                        </span>
                                        <span className="text-[11px] font-mono text-text-3">
                                            after.ts
                                        </span>
                                    </div>
                                    <span className="text-[9.5px] px-[7px] py-[2px] rounded-xs font-mono border border-green-border text-green bg-green-dim">
                                        ✦ enhanced
                                    </span>
                                </div>

                                <div
                                    className="px-[20px] py-[16px] flex flex-col gap-[10px]"
                                    style={{
                                        borderBottom:
                                            "1px solid rgba(255,255,255,0.07)",
                                        background: "#0f0f11",
                                    }}
                                >
                                    {(
                                        [
                                            {
                                                label: "title",
                                                value: (
                                                    <span className="text-[12.5px] text-text-1 font-semibold tracking-[-0.02em]">
                                                        {METADATA.title}
                                                    </span>
                                                ),
                                            },
                                            {
                                                label: "description",
                                                value: (
                                                    <span className="text-[11.5px] text-text-2 leading-[1.6]">
                                                        {METADATA.description}
                                                    </span>
                                                ),
                                            },
                                            {
                                                label: "tags",
                                                value: (
                                                    <div className="flex gap-[5px] flex-wrap">
                                                        {METADATA.tags.map(
                                                            (t) => (
                                                                <span
                                                                    key={t}
                                                                    className="text-[9.5px] px-[7px] py-[2px] border border-border-2 rounded-xs text-text-3 bg-bg-2 font-mono"
                                                                >
                                                                    #{t}
                                                                </span>
                                                            ),
                                                        )}
                                                    </div>
                                                ),
                                            },
                                            {
                                                label: "language",
                                                value: (
                                                    <span className="text-[11px] text-text-2 font-mono">
                                                        {METADATA.language}
                                                    </span>
                                                ),
                                            },
                                        ] as {
                                            label: string;
                                            value: React.ReactNode;
                                        }[]
                                    ).map(({ label, value }) => (
                                        <motion.div
                                            key={label}
                                            className="flex items-start gap-[12px]"
                                            initial={{ opacity: 0, x: -6 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            <span className="text-[10px] font-mono w-[80px] pt-[2px] flex-shrink-0 text-white/25">
                                                {label}
                                            </span>
                                            {value}
                                        </motion.div>
                                    ))}
                                </div>

                                <pre
                                    className="flex-1 px-[20px] py-[16px] text-[11.5px] leading-[1.85] whitespace-pre overflow-auto font-mono m-0"
                                    style={{ background: "#111113" }}
                                >
                                    {AFTER_LINES.map((line, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{
                                                delay: 0.2 + i * 0.03,
                                            }}
                                        >
                                            {line.tokens.length === 0 ? (
                                                <span>&nbsp;</span>
                                            ) : (
                                                line.tokens.map((t, j) => (
                                                    <span
                                                        key={j}
                                                        style={{
                                                            color: t.color,
                                                        }}
                                                    >
                                                        {t.text}
                                                    </span>
                                                ))
                                            )}
                                        </motion.div>
                                    ))}
                                </pre>

                                <div
                                    className="px-[16px] py-[10px] flex items-center gap-[8px]"
                                    style={{
                                        borderTop:
                                            "1px solid rgba(255,255,255,0.07)",
                                        background: "#0f0f11",
                                    }}
                                >
                                    <span
                                        className="w-[6px] h-[6px] rounded-full"
                                        style={{
                                            background: "#4ade80",
                                            boxShadow: "0 0 6px #4ade80",
                                        }}
                                    />
                                    <span className="text-[10px] font-mono text-green">
                                        ✓ title · description · tags · improved
                                        code generated
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                <div className="flex items-center justify-center gap-[12px] flex-wrap">
                    {!enhanced ? (
                        <>
                            <button
                                onClick={handleEnhance}
                                disabled={loading}
                                className="btn btn-solid disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <Sparkles size={13} />
                                {loading ? "Enhancing..." : "✦ enhance with AI"}
                            </button>
                            <span className="text-[11px] text-text-4 font-mono">
                                10 enhancements / day · powered by Claude
                            </span>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setEnhanced(false)}
                                className="btn btn-outline"
                            >
                                Reset demo
                            </button>
                            <Link href="/register" className="btn btn-solid">
                                Try it in Vault <ArrowRight size={13} />
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
