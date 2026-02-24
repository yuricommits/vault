"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface Snippet {
    id: string;
    title: string;
    description: string | null;
    language: string;
}

export default function SearchPalette() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Snippet[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const close = useCallback(() => {
        setOpen(false);
        setQuery("");
        setResults([]);
        setActiveIndex(0);
    }, []);

    useEffect(() => {
        const handler = () => {
            setOpen(true);
            setQuery("");
            setResults([]);
            setActiveIndex(0);
            setTimeout(() => inputRef.current?.focus(), 0);
        };
        window.addEventListener("open-search", handler);
        return () => window.removeEventListener("open-search", handler);
    }, []);

    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 0);
    }, [open]);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setActiveIndex(0);
            return;
        }
        const timeout = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `/api/search?q=${encodeURIComponent(query)}`,
                );
                const data = await res.json();
                setResults(Array.isArray(data) ? data : []);
                setActiveIndex(0);
            } finally {
                setLoading(false);
            }
        }, 200);
        return () => clearTimeout(timeout);
    }, [query]);

    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                close();
                return;
            }
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((i) => Math.min(i + 1, results.length - 1));
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, 0));
            }
            if (e.key === "Enter" && results[activeIndex]) {
                handleSelect(results[activeIndex].id);
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open, results, activeIndex, close]);

    const handleSelect = (id: string) => {
        close();
        router.push(`/dashboard?s=${id}`);
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) close();
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    />

                    {/* Palette */}
                    <motion.div
                        className="relative w-full max-w-[560px] mx-[16px] bg-bg border border-border rounded-md shadow-2xl overflow-hidden"
                        initial={{ opacity: 0, scale: 0.96, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: -8 }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Input */}
                        <div className="flex items-center gap-[10px] px-[16px] py-[14px] border-b border-border">
                            <Search
                                size={14}
                                className="text-text-4 flex-shrink-0"
                            />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="search snippets..."
                                className="flex-1 bg-transparent text-[13px] text-text-1 placeholder:text-text-4 outline-none font-mono"
                            />
                            {loading && (
                                <span className="text-[10px] text-text-4 font-mono flex-shrink-0">
                                    ...
                                </span>
                            )}
                            {!loading && query && (
                                <button
                                    onClick={() => setQuery("")}
                                    className="text-text-4 hover:text-text-1 transition-colors"
                                >
                                    <X size={12} />
                                </button>
                            )}
                            <kbd className="text-[10px] text-text-4 font-mono border border-border px-[5px] py-[2px] rounded-xs flex-shrink-0">
                                esc
                            </kbd>
                        </div>

                        {/* Results */}
                        <AnimatePresence mode="wait">
                            {results.length > 0 ? (
                                <motion.div
                                    key="results"
                                    className="max-h-[320px] overflow-y-auto"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.1 }}
                                >
                                    {results.map((snippet, i) => (
                                        <motion.button
                                            key={snippet.id}
                                            onClick={() =>
                                                handleSelect(snippet.id)
                                            }
                                            onMouseEnter={() =>
                                                setActiveIndex(i)
                                            }
                                            className={`w-full text-left px-[16px] py-[12px] flex items-center gap-[12px] border-b border-border last:border-0 transition-colors ${
                                                i === activeIndex
                                                    ? "bg-bg-2"
                                                    : "hover:bg-bg-1"
                                            }`}
                                            initial={{ opacity: 0, y: 4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.12,
                                                delay: i * 0.03,
                                            }}
                                        >
                                            <span className="text-[9.5px] font-mono text-text-4 border border-border px-[5px] py-[1px] rounded-xs bg-bg-2 flex-shrink-0">
                                                {snippet.language}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[12.5px] text-text-1 font-medium truncate">
                                                    {snippet.title}
                                                </p>
                                                {snippet.description && (
                                                    <p className="text-[11px] text-text-4 truncate mt-[1px]">
                                                        {snippet.description}
                                                    </p>
                                                )}
                                            </div>
                                            {i === activeIndex && (
                                                <kbd className="text-[10px] text-text-4 font-mono border border-border px-[5px] py-[2px] rounded-xs flex-shrink-0">
                                                    ↵
                                                </kbd>
                                            )}
                                        </motion.button>
                                    ))}
                                </motion.div>
                            ) : query && !loading ? (
                                <motion.div
                                    key="empty"
                                    className="px-[16px] py-[32px] text-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.1 }}
                                >
                                    <p className="text-[12px] text-text-4 font-mono">
                                        no snippets found
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="idle"
                                    className="px-[16px] py-[32px] text-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.1 }}
                                >
                                    <p className="text-[12px] text-text-4 font-mono">
                                        type to search snippets
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Footer */}
                        <div className="px-[16px] py-[8px] border-t border-border flex items-center gap-[12px]">
                            <span className="text-[10px] text-text-4 font-mono">
                                <kbd className="border border-border px-[4px] py-[1px] rounded-xs">
                                    ↑↓
                                </kbd>{" "}
                                navigate
                            </span>
                            <span className="text-[10px] text-text-4 font-mono">
                                <kbd className="border border-border px-[4px] py-[1px] rounded-xs">
                                    ↵
                                </kbd>{" "}
                                open
                            </span>
                            <span className="text-[10px] text-text-4 font-mono">
                                <kbd className="border border-border px-[4px] py-[1px] rounded-xs">
                                    esc
                                </kbd>{" "}
                                close
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
