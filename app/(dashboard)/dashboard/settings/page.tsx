"use client";
import { useState, useEffect } from "react";
import { Sparkles, Trash2, Eye, EyeOff } from "lucide-react";

export default function SettingsPage() {
    const [key, setKey] = useState("");
    const [masked, setMasked] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showKey, setShowKey] = useState(false);

    useEffect(() => {
        fetch("/api/user/key")
            .then((r) => r.json())
            .then((d) => setMasked(d.masked));
    }, []);

    const handleSave = async () => {
        setError("");
        setSuccess("");
        if (!key.startsWith("sk-ant-")) {
            setError("Key must start with sk-ant-");
            return;
        }
        setLoading(true);
        const res = await fetch("/api/user/key", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key }),
        });
        const data = await res.json();
        setLoading(false);
        if (!res.ok) {
            setError(data.error);
        } else {
            setMasked(data.masked);
            setKey("");
            setSuccess("API key saved successfully.");
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        await fetch("/api/user/key", { method: "DELETE" });
        setMasked(null);
        setDeleting(false);
        setSuccess("API key removed.");
    };

    return (
        <div className="max-w-[600px] mx-auto py-[40px] px-[24px]">
            <h1 className="text-[18px] font-semibold text-text-1 tracking-[-0.02em] mb-[8px]">
                Settings
            </h1>
            <p className="text-[12.5px] text-text-3 mb-[40px]">
                Manage your account preferences.
            </p>

            {/* API Key Section */}
            <div className="border border-border rounded-lg overflow-hidden">
                <div className="px-[20px] py-[16px] border-b border-border bg-bg-1 flex items-center gap-[10px]">
                    <Sparkles size={14} className="text-text-3" />
                    <div>
                        <p className="text-[12.5px] font-semibold text-text-1">
                            Anthropic API Key
                        </p>
                        <p className="text-[11px] text-text-4 mt-[2px]">
                            Used for AI enhancement. Your key is stored securely
                            and never shared.
                        </p>
                    </div>
                </div>

                <div className="px-[20px] py-[20px] bg-bg flex flex-col gap-[12px]">
                    {masked ? (
                        <div className="flex items-center gap-[10px]">
                            <div className="flex-1 px-[12px] py-[9px] border border-border rounded-sm bg-bg-1 flex items-center justify-between">
                                <span className="text-[12px] font-mono text-text-2">
                                    {showKey
                                        ? masked
                                        : "••••••••••••••••••••••••••••"}
                                </span>
                                <button
                                    onClick={() => setShowKey(!showKey)}
                                    className="text-text-4 hover:text-text-2 transition-colors ml-[8px]"
                                >
                                    {showKey ? (
                                        <EyeOff size={13} />
                                    ) : (
                                        <Eye size={13} />
                                    )}
                                </button>
                            </div>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="p-[9px] border border-border rounded-sm text-text-4 hover:text-red-400 hover:border-red-400/30 transition-colors bg-bg-1 disabled:opacity-40"
                            >
                                <Trash2 size={13} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-[10px]">
                            <input
                                type="password"
                                value={key}
                                onChange={(e) => setKey(e.target.value)}
                                placeholder="sk-ant-api03-..."
                                className="flex-1 px-[12px] py-[9px] border border-border rounded-sm bg-bg-1 text-[12px] font-mono text-text-1 placeholder:text-text-4 focus:border-border-3 transition-colors"
                            />
                            <button
                                onClick={handleSave}
                                disabled={loading || !key}
                                className="btn btn-solid disabled:opacity-40 disabled:cursor-not-allowed text-[12px] px-[16px] py-[9px]"
                            >
                                {loading ? "Saving..." : "Save"}
                            </button>
                        </div>
                    )}

                    {error && (
                        <p className="text-[11px] text-red-400 font-mono">
                            {error}
                        </p>
                    )}
                    {success && (
                        <p className="text-[11px] text-green font-mono">
                            ✓ {success}
                        </p>
                    )}

                    <p className="text-[11px] text-text-4 leading-[1.6]">
                        Get your key at{" "}
                        <a
                            href="https://console.anthropic.com/settings/keys"
                            target="_blank"
                            rel="noreferrer"
                            className="text-text-2 hover:text-text-1 transition-colors underline underline-offset-2"
                        >
                            console.anthropic.com
                        </a>
                        . Only you can use your key — it powers AI enhancement
                        in your vault.
                    </p>
                </div>
            </div>
        </div>
    );
}
