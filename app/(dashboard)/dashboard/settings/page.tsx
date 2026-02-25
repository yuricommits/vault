"use client";
import { useState, useEffect } from "react";
import {
    Sparkles,
    Trash2,
    Eye,
    EyeOff,
    Terminal,
    Plus,
    Copy,
    Check,
} from "lucide-react";

interface CliToken {
    id: string;
    name: string;
    createdAt: string;
    lastUsedAt: string | null;
}

const timeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
};

export default function SettingsPage() {
    const [key, setKey] = useState("");
    const [masked, setMasked] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showKey, setShowKey] = useState(false);

    // CLI Tokens
    const [tokens, setTokens] = useState<CliToken[]>([]);
    const [tokenName, setTokenName] = useState("");
    const [creatingToken, setCreatingToken] = useState(false);
    const [newToken, setNewToken] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [tokenError, setTokenError] = useState("");

    const fetchTokens = () => {
        fetch("/api/tokens")
            .then((r) => r.json())
            .then((d) => setTokens(Array.isArray(d) ? d : []));
    };

    useEffect(() => {
        fetch("/api/user/key")
            .then((r) => r.json())
            .then((d) => setMasked(d.masked));
        fetchTokens();
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

    const handleCreateToken = async () => {
        setTokenError("");
        if (!tokenName.trim()) {
            setTokenError("Token name is required");
            return;
        }
        setCreatingToken(true);
        const res = await fetch("/api/tokens", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: tokenName }),
        });
        const data = await res.json();
        setCreatingToken(false);
        if (!res.ok) {
            setTokenError(data.message);
            return;
        }
        setNewToken(data.token);
        setTokenName("");
        fetchTokens();
    };

    const handleRevokeToken = async (id: string) => {
        await fetch("/api/tokens", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        fetchTokens();
    };

    const handleCopy = () => {
        if (!newToken) return;
        navigator.clipboard.writeText(newToken);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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
            <div className="border border-border rounded-lg overflow-hidden mb-[24px]">
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
                                className="flex-1 px-[12px] py-[9px] border border-border rounded-sm bg-bg-1 text-[12px] font-mono text-text-1 placeholder:text-text-4 focus:border-border-3 transition-colors outline-none"
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

            {/* CLI Tokens Section */}
            <div className="border border-border rounded-lg overflow-hidden">
                <div className="px-[20px] py-[16px] border-b border-border bg-bg-1 flex items-center gap-[10px]">
                    <Terminal size={14} className="text-text-3" />
                    <div>
                        <p className="text-[12.5px] font-semibold text-text-1">
                            CLI Access Tokens
                        </p>
                        <p className="text-[11px] text-text-4 mt-[2px]">
                            Use these tokens to authenticate the Vault CLI from
                            your terminal.
                        </p>
                    </div>
                </div>

                <div className="px-[20px] py-[20px] bg-bg flex flex-col gap-[16px]">
                    {/* New token revealed */}
                    {newToken && (
                        <div className="border border-green-400/20 bg-green-400/5 rounded-sm p-[12px] flex flex-col gap-[8px]">
                            <p className="text-[11px] text-green-400 font-mono">
                                ✓ Token created — copy it now, it won&apos;t be
                                shown again.
                            </p>
                            <div className="flex items-center gap-[8px]">
                                <code className="flex-1 text-[11.5px] font-mono text-text-1 bg-bg-1 border border-border px-[10px] py-[7px] rounded-sm truncate">
                                    {newToken}
                                </code>
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-[5px] px-[10px] py-[7px] border border-border rounded-sm text-[11px] font-mono text-text-3 hover:text-text-1 transition-colors bg-bg-1 flex-shrink-0"
                                >
                                    {copied ? (
                                        <Check size={12} />
                                    ) : (
                                        <Copy size={12} />
                                    )}
                                    {copied ? "copied" : "copy"}
                                </button>
                            </div>
                            <button
                                onClick={() => setNewToken(null)}
                                className="text-[11px] text-text-4 hover:text-text-2 font-mono transition-colors text-left"
                            >
                                dismiss
                            </button>
                        </div>
                    )}

                    {/* Existing tokens */}
                    {tokens.length > 0 && (
                        <div className="flex flex-col gap-[2px]">
                            {tokens.map((token) => (
                                <div
                                    key={token.id}
                                    className="flex items-center justify-between px-[12px] py-[10px] border border-border rounded-sm bg-bg-1"
                                >
                                    <div>
                                        <p className="text-[12px] text-text-1 font-mono">
                                            {token.name}
                                        </p>
                                        <p className="text-[10px] text-text-4 font-mono mt-[2px]">
                                            created {timeAgo(token.createdAt)}
                                            {token.lastUsedAt &&
                                                ` · last used ${timeAgo(token.lastUsedAt)}`}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() =>
                                            handleRevokeToken(token.id)
                                        }
                                        className="p-[6px] text-text-4 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Create token */}
                    <div className="flex items-center gap-[10px]">
                        <input
                            value={tokenName}
                            onChange={(e) => setTokenName(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleCreateToken()
                            }
                            placeholder="Token name (e.g. macbook)"
                            className="flex-1 px-[12px] py-[9px] border border-border rounded-sm bg-bg-1 text-[12px] font-mono text-text-1 placeholder:text-text-4 focus:border-border-3 transition-colors outline-none"
                        />
                        <button
                            onClick={handleCreateToken}
                            disabled={creatingToken || !tokenName.trim()}
                            className="btn btn-solid disabled:opacity-40 disabled:cursor-not-allowed text-[12px] px-[12px] py-[9px] flex items-center gap-[5px]"
                        >
                            <Plus size={12} />
                            {creatingToken ? "creating..." : "create"}
                        </button>
                    </div>

                    {tokenError && (
                        <p className="text-[11px] text-red-400 font-mono">
                            {tokenError}
                        </p>
                    )}

                    <p className="text-[11px] text-text-4 leading-[1.6]">
                        Install the CLI with{" "}
                        <code className="text-text-2 bg-bg-1 px-[5px] py-[1px] rounded-xs border border-border">
                            go install github.com/yourusername/vault-cli@latest
                        </code>{" "}
                        then run{" "}
                        <code className="text-text-2 bg-bg-1 px-[5px] py-[1px] rounded-xs border border-border">
                            vault auth login --token &lt;token&gt;
                        </code>
                    </p>
                </div>
            </div>
        </div>
    );
}
