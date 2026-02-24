"use client";
import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import SnippetDetail from "@/components/dashboard/snippet-detail";
import AIPromo from "@/components/dashboard/ai-promo";
import NewSnippetPane from "@/components/dashboard/new-snippet-pane";

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

function DashboardPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const selectedId = searchParams.get("s");

    const [snippets, setSnippets] = useState<Snippet[]>([]);
    const [selected, setSelected] = useState<Snippet | null>(null);
    const [showPromo, setShowPromo] = useState(true);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    const fetchSnippets = useCallback(() => {
        fetch("/api/snippets")
            .then((r) => r.json())
            .then((data) => {
                setSnippets(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchSnippets();
    }, [fetchSnippets]);

    useEffect(() => {
        if (!selectedId) {
            setSelected(null);
            return;
        }
        if (selected?.id === selectedId) return;
        if (!loading) {
            const local = snippets.find((s) => s.id === selectedId);
            if (local) {
                setSelected(local);
                return;
            }
        }
        fetch(`/api/snippets/${selectedId}`)
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => {
                if (data) setSelected(data);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedId, loading]);

    const handleSelect = (snippet: Snippet) => {
        setSelected(snippet);
        setCreating(false);
        setShowPromo(false);
        router.push(`/dashboard?s=${snippet.id}`);
    };

    const handleClose = () => {
        setSelected(null);
        setShowPromo(true);
        router.push("/dashboard");
    };

    const handleDelete = async () => {
        if (!selected) return;
        await fetch(`/api/snippets/${selected.id}`, { method: "DELETE" });
        setSelected(null);
        setShowPromo(true);
        router.push("/dashboard");
        fetchSnippets();
    };

    const handleCreated = (snippet: Snippet) => {
        setSnippets((prev) => [snippet, ...prev]);
        setCreating(false);
        setSelected(snippet);
        router.push(`/dashboard?s=${snippet.id}`);
    };

    const handleSave = async (updates: Partial<Snippet>) => {
        if (!selected) return;
        await fetch(`/api/snippets/${selected.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
        });
        const updated = { ...selected, ...updates } as Snippet;
        setSelected(updated);
        setSnippets((prev) =>
            prev.map((s) => (s.id === updated.id ? updated : s)),
        );
    };

    const showRightPane = selected || creating || showPromo;

    return (
        <div className="flex h-full gap-6 overflow-hidden">
            {/* Left pane */}
            <div
                className={`flex flex-col flex-shrink-0 overflow-hidden ${showRightPane ? "w-[300px] border-r border-border" : "flex-1"}`}
            >
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
                    <button
                        onClick={() => {
                            setCreating(true);
                            setSelected(null);
                            setShowPromo(false);
                            router.push("/dashboard");
                        }}
                        className="btn btn-solid text-[11.5px] px-[12px] py-[7px]"
                    >
                        <Plus size={12} /> new
                    </button>
                </div>

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
                            <button
                                onClick={() => {
                                    setCreating(true);
                                    setShowPromo(false);
                                    router.push("/dashboard");
                                }}
                                className="btn btn-solid text-[11.5px]"
                            >
                                + new snippet
                            </button>
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
                                    <div className="flex items-center gap-[6px] overflow-hidden">
                                        <span className="text-[9.5px] font-mono text-text-4 border border-border px-[5px] py-[1px] rounded-xs bg-bg-2 flex-shrink-0">
                                            {snippet.language}
                                        </span>
                                        {snippet.description && (
                                            <div className="min-w-0 flex-1 overflow-hidden">
                                                <span className="text-[11px] text-text-4 block truncate">
                                                    {snippet.description}
                                                </span>
                                            </div>
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
                <div className="flex-1 w-0 overflow-hidden">
                    <SnippetDetail
                        key={selected.id}
                        snippet={selected}
                        onClose={handleClose}
                        onDeleteAction={handleDelete}
                        onSaveAction={handleSave}
                    />
                </div>
            ) : creating ? (
                <div className="flex-1 w-0 overflow-hidden">
                    <NewSnippetPane
                        onClose={() => {
                            setCreating(false);
                            setShowPromo(true);
                        }}
                        onCreated={handleCreated}
                    />
                </div>
            ) : showPromo ? (
                <div className="flex-1 w-0 overflow-hidden">
                    <AIPromo onClose={() => setShowPromo(false)} />
                </div>
            ) : null}
        </div>
    );
}

export default function Page() {
    return (
        <Suspense
            fallback={
                <div className="p-8 text-text-4 font-mono text-[12px]">
                    loading...
                </div>
            }
        >
            <DashboardPage />
        </Suspense>
    );
}
