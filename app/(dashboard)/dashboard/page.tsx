"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import SnippetDetail from "@/components/dashboard/snippet-detail";
import AIPromo from "@/components/dashboard/ai-promo";

function timeAgo(date: Date) {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return date.toLocaleDateString();
}

interface Snippet {
    id: string;
    title: string;
    description: string | null;
    language: string;
    code: string;
    createdAt: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const selectedId = searchParams.get("s");

    const [snippets, setSnippets] = useState<Snippet[]>([]);
    const [selected, setSelected] = useState<Snippet | null>(null);
    const [showPromo, setShowPromo] = useState(true);
    const [loading, setLoading] = useState(true);

    const fetchSnippets = useCallback(async () => {
        const res = await fetch("/api/snippets");
        const data = await res.json();
        setSnippets(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchSnippets();
    }, [fetchSnippets]);

    useEffect(() => {
        if (selectedId) {
            fetch(`/api/snippets/${selectedId}`)
                .then((r) => r.json())
                .then((data) => setSelected(data));
        } else {
            setSelected(null);
        }
    }, [selectedId]);

    const handleSelect = (snippet: Snippet) => {
        router.push(`/dashboard?s=${snippet.id}`);
        setShowPromo(false);
    };

    const handleClose = () => {
        router.push("/dashboard");
        setSelected(null);
    };

    const handleDelete = async () => {
        if (!selected) return;
        await fetch(`/api/snippets/${selected.id}`, { method: "DELETE" });
        router.push("/dashboard");
        setSelected(null);
        fetchSnippets();
    };

    const handleSave = async (updates: Partial<Snippet>) => {
        if (!selected) return;
        await fetch(`/api/snippets/${selected.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
        });
        const updated = { ...selected, ...updates };
        setSelected(updated as Snippet);
        setSnippets((prev) =>
            prev.map((s) => (s.id === updated.id ? (updated as Snippet) : s)),
        );
    };

    const showRightPane = selected || (showPromo && !selectedId);

    return (
        <div className="flex h-full gap-0">
            {/* Left pane — snippet list */}
            <div
                className={`flex flex-col flex-shrink-0 ${showRightPane ? "w-[300px] border-r border-border" : "flex-1"}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-[20px] py-[16px] border-b border-border">
                    <div>
                        <span className="label block mb-[4px]">
                            {"// snippets"}
                        </span>
                        <h1 className="text-[16px] font-semibold text-text-1 tracking-[-0.03em]">
                            {loading
                                ? "—"
                                : `${snippets.length} snippet${snippets.length === 1 ? "" : "s"}`}
                        </h1>
                    </div>
                    <Link
                        href="/dashboard/snippets/new"
                        className="btn btn-solid text-[11.5px] px-[12px] py-[7px]"
                    >
                        <Plus size={12} /> new
                    </Link>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-[60px] text-[12px] text-text-4 font-mono">
                            loading...
                        </div>
                    ) : snippets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-[60px] gap-[12px] text-center px-[20px]">
                            <div className="w-[40px] h-[40px] border border-border-2 rounded-md flex items-center justify-center text-text-4 bg-bg-1">
                                <Plus size={16} />
                            </div>
                            <p className="text-[12px] text-text-4 font-mono">
                                your vault is empty
                            </p>
                            <Link
                                href="/dashboard/snippets/new"
                                className="btn btn-solid text-[11.5px]"
                            >
                                + new snippet
                            </Link>
                        </div>
                    ) : (
                        <div>
                            {snippets.map((snippet, i) => (
                                <button
                                    key={snippet.id}
                                    onClick={() => handleSelect(snippet)}
                                    className={`w-full text-left px-[20px] py-[14px] flex flex-col gap-[4px] transition-colors duration-[0.18s] border-b border-border cursor-pointer ${
                                        selectedId === snippet.id
                                            ? "bg-bg-2 border-l-2 border-l-white"
                                            : "hover:bg-bg-1 border-l-2 border-l-transparent"
                                    } ${i === snippets.length - 1 ? "border-b-0" : ""}`}
                                >
                                    <div className="flex items-center justify-between gap-[8px]">
                                        <span className="text-[12.5px] text-text-1 font-medium truncate">
                                            {snippet.title}
                                        </span>
                                        <span className="text-[10px] text-text-4 font-mono flex-shrink-0">
                                            {timeAgo(
                                                new Date(snippet.createdAt),
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-[6px]">
                                        <span className="text-[9.5px] font-mono text-text-4 border border-border px-[5px] py-[1px] rounded-xs bg-bg-2">
                                            {snippet.language}
                                        </span>
                                        {snippet.description && (
                                            <span className="text-[11px] text-text-4 truncate">
                                                {snippet.description}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right pane */}
            {selected ? (
                <div className="flex-1 overflow-y-auto">
                    <SnippetDetail
                        snippet={selected}
                        onClose={handleClose}
                        onDelete={handleDelete}
                        onSave={handleSave}
                    />
                </div>
            ) : showPromo && !selectedId ? (
                <div className="flex-1 overflow-y-auto">
                    <AIPromo onClose={() => setShowPromo(false)} />
                </div>
            ) : null}
        </div>
    );
}
