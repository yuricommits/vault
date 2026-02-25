"use client";
import { useState, useEffect } from "react";
import { MessageSquare, Bug, Lightbulb, Check, Clock } from "lucide-react";

interface FeedbackEntry {
    id: string;
    type: string;
    message: string;
    status: string;
    reply: string | null;
    createdAt: string;
    repliedAt: string | null;
    user: { id: string; name: string; email: string } | null;
}

function timeAgo(date: string) {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

const typeIcon = (type: string) => {
    if (type === "bug") return <Bug size={12} className="text-red-400" />;
    if (type === "feature")
        return <Lightbulb size={12} className="text-yellow-400" />;
    return <MessageSquare size={12} className="text-text-3" />;
};

export default function AdminFeedback() {
    const [entries, setEntries] = useState<FeedbackEntry[]>([]);
    const [sending, setSending] = useState(false);
    const [filter, setFilter] = useState<"all" | "unread" | "resolved">(
        "unread",
    );

    useEffect(() => {
        fetch("/api/admin/feedback")
            .then((r) => r.json())
            .then((d) => setEntries(Array.isArray(d) ? d : []));
    }, []);

    const handleResolve = async (entry: FeedbackEntry) => {
        setSending(true);
        const res = await fetch("/api/admin/feedback", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: entry.id, status: "replied" }),
        });
        const updated = await res.json();
        setSending(false);
        setEntries((prev) =>
            prev.map((e) => (e.id === updated.id ? updated : e)),
        );
    };

    const handleReopen = async (entry: FeedbackEntry) => {
        setSending(true);
        const res = await fetch("/api/admin/feedback", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: entry.id, status: "open" }),
        });
        const updated = await res.json();
        setSending(false);
        setEntries((prev) =>
            prev.map((e) => (e.id === updated.id ? updated : e)),
        );
    };

    const filtered = entries.filter((e) => {
        if (filter === "all") return true;
        if (filter === "unread") return e.status === "open";
        if (filter === "resolved") return e.status === "replied";
        return true;
    });

    const openCount = entries.filter((e) => e.status === "open").length;

    return (
        <div className="max-w-[680px] mx-auto py-[40px] px-[24px]">
            {/* Header */}
            <div className="mb-[32px]">
                <span className="label block mb-[4px]">{"// admin"}</span>
                <div className="flex items-center justify-between">
                    <h1 className="text-[18px] font-semibold text-text-1 tracking-[-0.02em] flex items-center gap-[8px]">
                        Feedback
                        {openCount > 0 && (
                            <span className="text-[11px] bg-white/10 border border-border px-[6px] py-[1px] rounded-xs font-mono">
                                {openCount} unread
                            </span>
                        )}
                    </h1>
                </div>
                <p className="text-[12.5px] text-text-3 mt-[4px]">
                    User submitted feedback and bug reports.
                </p>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-[2px] border-b border-border mb-[24px]">
                {(["all", "unread", "resolved"] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-[14px] py-[8px] text-[11px] font-mono transition-colors flex items-center gap-[4px] ${
                            filter === f
                                ? "text-text-1 border-b-2 border-white"
                                : "text-text-4 hover:text-text-2"
                        }`}
                    >
                        {f}
                        {f === "unread" && openCount > 0 && (
                            <span className="text-[9px] bg-white/10 px-[4px] py-[1px] rounded-xs">
                                {openCount}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* List */}
            {filtered.length === 0 ? (
                <div className="flex items-center justify-center py-[80px] text-[12px] text-text-4 font-mono">
                    {filter === "unread"
                        ? "no unread feedback"
                        : "no feedback yet"}
                </div>
            ) : (
                <div className="flex flex-col gap-[10px]">
                    {filtered.map((entry) => (
                        <div
                            key={entry.id}
                            className="border border-border rounded-sm overflow-hidden"
                        >
                            {/* Entry header */}
                            <div className="px-[16px] py-[12px] bg-bg-1 border-b border-border flex items-center justify-between">
                                <div className="flex items-center gap-[8px]">
                                    {typeIcon(entry.type)}
                                    <span className="text-[12px] text-text-1 font-medium">
                                        {entry.user?.name ?? "anonymous"}
                                    </span>
                                    <span className="text-[10px] text-text-4 border border-border px-[5px] py-[1px] rounded-xs font-mono">
                                        {entry.type}
                                    </span>
                                </div>
                                <div className="flex items-center gap-[10px]">
                                    <span className="text-[10px] text-text-4 font-mono">
                                        {entry.user?.email ?? "no email"} ·{" "}
                                        {timeAgo(entry.createdAt)}
                                    </span>
                                    {entry.status === "open" ? (
                                        <button
                                            onClick={() => handleResolve(entry)}
                                            disabled={sending}
                                            className="flex items-center gap-[4px] px-[8px] py-[4px] border border-border rounded-xs text-[10px] font-mono text-text-4 hover:text-green-400 hover:border-green-400/30 transition-colors disabled:opacity-40"
                                        >
                                            <Check size={10} />
                                            resolve
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleReopen(entry)}
                                            disabled={sending}
                                            className="flex items-center gap-[4px] px-[8px] py-[4px] border border-border rounded-xs text-[10px] font-mono text-text-4 hover:text-text-1 transition-colors disabled:opacity-40"
                                        >
                                            <Clock size={10} />
                                            reopen
                                        </button>
                                    )}
                                </div>
                            </div>
                            {/* Message */}
                            <div className="px-[16px] py-[14px] bg-bg">
                                <p className="text-[12.5px] text-text-1 leading-[1.8] whitespace-pre-wrap">
                                    {entry.message}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
