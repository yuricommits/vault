"use client";
import { useState, useEffect } from "react";
import { MessageSquare, Bug, Lightbulb, Check, Clock, Send } from "lucide-react";

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
    if (type === "feature") return <Lightbulb size={12} className="text-yellow-400" />;
    return <MessageSquare size={12} className="text-text-3" />;
};

export default function AdminFeedback() {
    const [entries, setEntries] = useState<FeedbackEntry[]>([]);
    const [selected, setSelected] = useState<FeedbackEntry | null>(null);
    const [reply, setReply] = useState("");
    const [sending, setSending] = useState(false);
    const [filter, setFilter] = useState<"all" | "open" | "replied">("all");

    useEffect(() => {
        fetch("/api/admin/feedback")
            .then((r) => r.json())
            .then((d) => setEntries(Array.isArray(d) ? d : []));
    }, []);

    const handleReply = async () => {
        if (!selected || !reply.trim()) return;
        setSending(true);
        const res = await fetch("/api/admin/feedback", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: selected.id, reply, status: "replied" }),
        });
        const updated = await res.json();
        setSending(false);
        setEntries((prev) => prev.map((e) => e.id === updated.id ? updated : e));
        setSelected(updated);
        setReply("");
    };

    const filtered = entries.filter((e) => filter === "all" ? true : e.status === filter);
    const openCount = entries.filter((e) => e.status === "open").length;

    return (
        <div className="flex h-full overflow-hidden">
            {/* Left pane */}
            <div className="w-[320px] flex-shrink-0 border-r border-border flex flex-col">
                <div className="px-[20px] py-[16px] border-b border-border flex items-center justify-between">
                    <div>
                        <span className="label block mb-[4px]">{"// admin"}</span>
                        <h1 className="text-[16px] font-semibold text-text-1 tracking-[-0.03em]">
                            Feedback
                            {openCount > 0 && (
                                <span className="ml-[8px] text-[11px] bg-white/10 border border-border px-[6px] py-[1px] rounded-xs font-mono">
                                    {openCount} open
                                </span>
                            )}
                        </h1>
                    </div>
                </div>

                {/* Filter */}
                <div className="flex border-b border-border">
                    {(["all", "open", "replied"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`flex-1 py-[8px] text-[11px] font-mono transition-colors ${
                                filter === f
                                    ? "text-text-1 border-b-2 border-white"
                                    : "text-text-4 hover:text-text-2"
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto">
                    {filtered.length === 0 ? (
                        <div className="flex items-center justify-center py-[60px] text-[12px] text-text-4 font-mono">
                            no feedback yet
                        </div>
                    ) : (
                        filtered.map((entry) => (
                            <button
                                key={entry.id}
                                onClick={() => { setSelected(entry); setReply(""); }}
                                className={`w-full text-left px-[20px] py-[14px] flex flex-col gap-[4px] border-b border-border transition-colors ${
                                    selected?.id === entry.id
                                        ? "bg-bg-2 border-l-2 border-l-white"
                                        : "hover:bg-bg-1 border-l-2 border-l-transparent"
                                }`}
                            >
                                <div className="flex items-center justify-between gap-[8px]">
                                    <div className="flex items-center gap-[6px]">
                                        {typeIcon(entry.type)}
                                        <span className="text-[12px] text-text-1 font-medium truncate">
                                            {entry.user?.name ?? "anonymous"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-[6px] flex-shrink-0">
                                        {entry.status === "replied"
                                            ? <Check size={11} className="text-green-400" />
                                            : <Clock size={11} className="text-text-4" />
                                        }
                                        <span className="text-[10px] text-text-4 font-mono">
                                            {timeAgo(entry.createdAt)}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-[11px] text-text-4 truncate">
                                    {entry.message}
                                </p>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Right pane */}
            {selected ? (
                <div className="flex-1 w-0 overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="px-[24px] py-[14px] border-b border-border flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-[8px]">
                            {typeIcon(selected.type)}
                            <span className="text-[12px] text-text-1 font-semibold">{selected.type}</span>
                            <span className="text-[10px] text-text-4 font-mono border border-border px-[5px] py-[1px] rounded-xs">
                                {selected.status}
                            </span>
                        </div>
                        <div className="text-[11px] text-text-4 font-mono">
                            {selected.user?.email ?? "no email"} · {timeAgo(selected.createdAt)}
                        </div>
                    </div>

                    {/* Message */}
                    <div className="flex-1 overflow-y-auto px-[24px] py-[24px] flex flex-col gap-[24px]">
                        {/* User message */}
                        <div className="flex flex-col gap-[8px]">
                            <span className="text-[10px] text-text-4 font-mono uppercase tracking-widest">
                                {selected.user?.name ?? "user"}
                            </span>
                            <div className="border border-border rounded-sm bg-bg-1 px-[16px] py-[14px]">
                                <p className="text-[12.5px] text-text-1 leading-[1.8] whitespace-pre-wrap font-mono">
                                    {selected.message}
                                </p>
                            </div>
                        </div>

                        {/* Existing reply */}
                        {selected.reply && (
                            <div className="flex flex-col gap-[8px]">
                                <span className="text-[10px] text-green-400 font-mono uppercase tracking-widest">
                                    you · {selected.repliedAt ? timeAgo(selected.repliedAt) : ""}
                                </span>
                                <div className="border border-green-400/20 rounded-sm bg-green-400/5 px-[16px] py-[14px]">
                                    <p className="text-[12.5px] text-text-1 leading-[1.8] whitespace-pre-wrap font-mono">
                                        {selected.reply}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Reply box */}
                    <div className="px-[24px] py-[16px] border-t border-border flex-shrink-0 flex gap-[10px]">
                        <textarea
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            placeholder="Write a reply... (stored in DB, visible to you only)"
                            rows={3}
                            className="flex-1 px-[12px] py-[10px] bg-bg-1 border border-border rounded-sm text-[12px] text-text-1 placeholder:text-text-4 font-mono resize-none outline-none focus:border-border-3 transition-colors leading-[1.7]"
                        />
                        <button
                            onClick={handleReply}
                            disabled={sending || !reply.trim()}
                            className="btn btn-solid px-[14px] flex items-center gap-[6px] text-[11.5px] self-end disabled:opacity-40"
                        >
                            <Send size={11} />
                            {sending ? "saving..." : "reply"}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-[12px] text-text-4 font-mono">
                    select a feedback to view
                </div>
            )}
        </div>
    );
}
