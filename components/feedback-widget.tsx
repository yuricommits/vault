"use client";
import { useState } from "react";
import { MessageSquare, X, Send, Check } from "lucide-react";

type FeedbackType = "bug" | "feature" | "general";

export default function FeedbackWidget() {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState<FeedbackType>("general");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        if (!message.trim()) { setError("Message is required"); return; }
        setError("");
        setSending(true);
        const res = await fetch("/api/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type, message }),
        });
        setSending(false);
        if (!res.ok) { setError("Failed to send feedback"); return; }
        setSent(true);
        setTimeout(() => {
            setOpen(false);
            setSent(false);
            setMessage("");
            setType("general");
        }, 2000);
    };

    return (
        <div className="fixed bottom-[24px] right-[24px] z-50 flex flex-col items-end gap-[12px]">
            {/* Popover */}
            {open && (
                <div className="w-[320px] border border-border rounded-md bg-bg shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-[16px] py-[12px] border-b border-border bg-bg-1">
                        <span className="text-[12.5px] font-semibold text-text-1">Send feedback</span>
                        <button onClick={() => setOpen(false)} className="text-text-4 hover:text-text-1 transition-colors">
                            <X size={13} />
                        </button>
                    </div>

                    {sent ? (
                        <div className="px-[16px] py-[32px] flex flex-col items-center gap-[8px]">
                            <div className="w-[32px] h-[32px] rounded-full bg-green-400/10 border border-green-400/20 flex items-center justify-center">
                                <Check size={14} className="text-green-400" />
                            </div>
                            <p className="text-[12px] text-text-1 font-mono">Thanks for the feedback!</p>
                        </div>
                    ) : (
                        <div className="px-[16px] py-[16px] flex flex-col gap-[12px]">
                            {/* Type selector */}
                            <div className="flex gap-[6px]">
                                {(["bug", "feature", "general"] as FeedbackType[]).map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setType(t)}
                                        className={`flex-1 py-[6px] text-[10.5px] font-mono border rounded-sm transition-all ${
                                            type === t
                                                ? "border-white/30 bg-white/10 text-text-1"
                                                : "border-border text-text-4 hover:text-text-2 hover:border-border-2 bg-bg-1"
                                        }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>

                            {/* Message */}
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={
                                    type === "bug" ? "Describe the bug..."
                                    : type === "feature" ? "Describe the feature..."
                                    : "Share your thoughts..."
                                }
                                rows={4}
                                className="w-full px-[12px] py-[10px] bg-bg-1 border border-border rounded-sm text-[12px] text-text-1 placeholder:text-text-4 font-mono resize-none outline-none focus:border-border-3 transition-colors leading-[1.7]"
                            />

                            {error && <p className="text-[11px] text-red-400 font-mono">{error}</p>}

                            <button
                                onClick={handleSubmit}
                                disabled={sending || !message.trim()}
                                className="btn btn-solid text-[11.5px] py-[8px] flex items-center justify-center gap-[6px] disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <Send size={11} />
                                {sending ? "sending..." : "send feedback"}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Trigger button */}
            <button
                onClick={() => setOpen(!open)}
                className={`flex items-center gap-[7px] px-[14px] py-[9px] border rounded-sm text-[11.5px] font-mono transition-all shadow-lg ${
                    open
                        ? "bg-bg-2 border-border-2 text-text-1"
                        : "bg-bg-1 border-border text-text-3 hover:text-text-1 hover:border-border-2"
                }`}
            >
                <MessageSquare size={13} />
                feedback
            </button>
        </div>
    );
}
