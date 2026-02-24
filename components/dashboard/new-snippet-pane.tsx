"use client";
import { useState } from "react";
import { X, Sparkles } from "lucide-react";

const LANGUAGES = [
    "javascript",
    "typescript",
    "python",
    "rust",
    "go",
    "java",
    "css",
    "html",
    "bash",
    "sql",
    "json",
    "markdown",
];

interface Snippet {
    id: string;
    title: string;
    description: string | null;
    language: string;
    code: string;
    createdAt: string;
}

export default function NewSnippetPane({
    onClose,
    onCreated,
}: {
    onClose: () => void;
    onCreated: (snippet: Snippet) => void;
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [language, setLanguage] = useState("typescript");
    const [code, setCode] = useState("");
    const [saving, setSaving] = useState(false);
    const [enhancing, setEnhancing] = useState(false);
    const [error, setError] = useState("");
    const [enhanced, setEnhanced] = useState(false);

    const handleEnhance = async () => {
        if (!code.trim()) {
            setError("Paste some code first to enhance");
            return;
        }
        setError("");
        setEnhancing(true);
        setEnhanced(false);
        try {
            const res = await fetch("/api/user/enhance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, language }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error ?? "Enhancement failed");
                return;
            }
            if (data.title) setTitle(data.title);
            if (data.description) setDescription(data.description);
            if (data.improvedCode) setCode(data.improvedCode);
            if (data.language) setLanguage(data.language);
            setEnhanced(true);
        } catch {
            setError("Something went wrong");
        } finally {
            setEnhancing(false);
        }
    };

    const handleSave = async () => {
        if (!title.trim()) {
            setError("Title is required");
            return;
        }
        if (!code.trim()) {
            setError("Code is required");
            return;
        }
        setError("");
        setSaving(true);
        try {
            const res = await fetch("/api/snippets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, code, language }),
            });
            if (!res.ok) throw new Error();
            const snippet = await res.json();
            onCreated(snippet);
        } catch {
            setError("Something went wrong");
        } finally {
            setSaving(false);
        }
    };

    const inputBase =
        "px-[10px] py-[8px] bg-bg border border-border text-[12.5px] text-text-1 placeholder:text-text-4 focus:border-border-3 focus:outline-none transition-colors font-mono rounded-sm";

    return (
        <div className="flex flex-col h-full min-w-0 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-[24px] py-[14px] border-b border-border flex-shrink-0">
                <div className="min-w-0 flex-1">
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Snippet title"
                        className={`${inputBase} w-full text-[14px] font-semibold`}
                        autoFocus
                    />
                </div>
                <div className="flex items-center gap-[6px] flex-shrink-0 ml-[12px]">
                    <button
                        onClick={handleEnhance}
                        disabled={enhancing || saving}
                        title={
                            enhancing
                                ? "enhancing..."
                                : enhanced
                                  ? "enhanced"
                                  : "enhance with AI"
                        }
                        className={`flex items-center justify-center px-[10px] h-[30px] border rounded-sm transition-all disabled:opacity-50 ${
                            enhanced
                                ? "text-green-400 border-green-400/30 bg-green-400/5"
                                : "text-text-3 border-border hover:text-text-1 hover:border-border-2 bg-bg-1"
                        }`}
                    >
                        <Sparkles size={12} />
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || enhancing}
                        className="btn btn-solid text-[11.5px] px-[12px] py-[6px] disabled:opacity-50"
                    >
                        {saving ? "saving..." : "save"}
                    </button>
                    <button
                        onClick={onClose}
                        className="text-text-4 hover:text-text-1 transition-colors p-[6px] ml-[4px]"
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>

            {/* Metadata */}
            <div className="px-[24px] py-[14px] border-b border-border flex-shrink-0">
                <div className="flex gap-[10px]">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className={`${inputBase} w-[160px] flex-shrink-0`}
                    >
                        {LANGUAGES.map((l) => (
                            <option key={l} value={l}>
                                {l}
                            </option>
                        ))}
                    </select>
                    <input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description (optional)"
                        className={`${inputBase} flex-1 min-w-0`}
                    />
                </div>
                {error && (
                    <p className="text-[11px] text-red-400 font-mono mt-[8px]">
                        {error}
                    </p>
                )}
                {enhanced && !error && (
                    <p className="text-[11px] text-green-400 font-mono mt-[8px]">
                        ✓ title · description · improved code generated
                    </p>
                )}
            </div>

            {/* Code */}
            <div className="flex-1 min-w-0 overflow-auto bg-[#0d0d0d]">
                <textarea
                    value={code}
                    onChange={(e) => {
                        setCode(e.target.value);
                        setEnhanced(false);
                    }}
                    placeholder="// paste your code here"
                    className="w-full h-full min-h-[400px] px-[24px] py-[20px] bg-transparent text-[12px] text-text-2 font-mono leading-[1.75] resize-none border-none outline-none placeholder:text-text-4"
                    spellCheck={false}
                />
            </div>
        </div>
    );
}
