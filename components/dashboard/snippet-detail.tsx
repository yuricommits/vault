"use client";
import { useState, useEffect } from "react";
import { X, Copy, Check, Pencil, Trash2, ChevronLeft } from "lucide-react";

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

const LANGUAGE_MAP: Record<string, string> = {
    javascript: "javascript",
    typescript: "typescript",
    python: "python",
    rust: "rust",
    go: "go",
    java: "java",
    css: "css",
    html: "html",
    bash: "bash",
    sql: "sql",
    json: "json",
    markdown: "markdown",
};

interface Snippet {
    id: string;
    title: string;
    description: string | null;
    language: string;
    code: string;
    createdAt: string;
}

function formatDate(date: Date) {
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export default function SnippetDetail({
    snippet,
    onClose,
    onDeleteAction,
    onSaveAction,
}: {
    snippet: Snippet;
    onClose: () => void;
    onDeleteAction: () => void;
    onSaveAction: (updates: Partial<Snippet>) => Promise<void>;
}) {
    const [editing, setEditing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [saving, setSaving] = useState(false);

    const [title, setTitle] = useState(snippet.title);
    const [description, setDescription] = useState(snippet.description ?? "");
    const [code, setCode] = useState(snippet.code);
    const [language, setLanguage] = useState(snippet.language);
    const [highlightedHtml, setHighlightedHtml] = useState<string>("");

    useEffect(() => {
        const lang = LANGUAGE_MAP[snippet.language] ?? "plaintext";
        import("shiki")
            .then(({ codeToHtml }) =>
                codeToHtml(snippet.code, { lang, theme: "vesper" }),
            )
            .then(setHighlightedHtml)
            .catch(() => setHighlightedHtml(""));
    }, [snippet.code, snippet.language]);

    const handleCopy = () => {
        navigator.clipboard.writeText(snippet.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSave = async () => {
        setSaving(true);
        await onSaveAction({ title, description, code, language });
        setSaving(false);
        setEditing(false);
    };

    const handleDelete = async () => {
        if (!deleting) {
            setDeleting(true);
            return;
        }
        await onDeleteAction();
    };

    // Base input class WITHOUT w-full so we can control width per-input
    const inputBase =
        "px-[10px] py-[8px] bg-bg border border-border text-[12.5px] text-text-1 placeholder:text-text-4 focus:border-border-3 focus:outline-none transition-colors font-mono rounded-sm";

    return (
        <div className="flex flex-col h-full min-w-0 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-[24px] py-[14px] border-b border-border flex-shrink-0 overflow-hidden">
                <div className="flex items-center gap-[12px] min-w-0 flex-1">
                    {editing && (
                        <button
                            onClick={() => setEditing(false)}
                            className="text-text-4 hover:text-text-1 transition-colors flex-shrink-0"
                        >
                            <ChevronLeft size={15} />
                        </button>
                    )}
                    <div className="min-w-0 flex-1">
                        {editing ? (
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className={`${inputBase} w-full text-[14px] font-semibold`}
                                placeholder="Title"
                            />
                        ) : (
                            <h2 className="text-[14px] font-semibold text-text-1 tracking-[-0.02em] truncate">
                                {snippet.title}
                            </h2>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-[6px] flex-shrink-0 ml-[12px]">
                    {!editing ? (
                        <>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-[5px] text-[11.5px] font-mono text-text-3 hover:text-text-1 px-[10px] py-[6px] border border-border hover:border-border-2 rounded-sm transition-all bg-bg-1"
                            >
                                {copied ? (
                                    <Check size={12} className="text-green" />
                                ) : (
                                    <Copy size={12} />
                                )}
                                {copied ? "copied" : "copy"}
                            </button>
                            <button
                                onClick={() => setEditing(true)}
                                className="flex items-center gap-[5px] text-[11.5px] font-mono text-text-3 hover:text-text-1 px-[10px] py-[6px] border border-border hover:border-border-2 rounded-sm transition-all bg-bg-1"
                            >
                                <Pencil size={12} /> edit
                            </button>
                            <button
                                onClick={onClose}
                                className="text-text-4 hover:text-text-1 transition-colors p-[6px] ml-[4px]"
                            >
                                <X size={14} />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="btn btn-solid text-[11.5px] px-[12px] py-[6px] disabled:opacity-50"
                            >
                                {saving ? "saving..." : "save"}
                            </button>
                            <button
                                onClick={handleDelete}
                                className={`flex items-center gap-[5px] text-[11.5px] font-mono px-[12px] py-[8px] border rounded-sm transition-all ${
                                    deleting
                                        ? "text-red-400 border-red-400/30 bg-red-400/5"
                                        : "text-text-3 border-border hover:text-red-400 hover:border-red-400/30 bg-bg-1"
                                }`}
                            >
                                <Trash2 size={12} />
                                {deleting ? "confirm delete" : "delete"}
                            </button>
                            {deleting && (
                                <button
                                    onClick={() => setDeleting(false)}
                                    className="text-[11.5px] font-mono text-text-4 hover:text-text-1 transition-colors"
                                >
                                    cancel
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Metadata */}
            {!editing ? (
                <div className="px-[24px] py-[14px] border-b border-border flex items-center gap-[12px] flex-shrink-0 overflow-hidden">
                    <span className="text-[10px] font-mono text-text-4 border border-border px-[6px] py-[2px] rounded-xs bg-bg-2 flex-shrink-0">
                        {snippet.language}
                    </span>
                    {snippet.description && (
                        <div className="flex-1 min-w-0">
                            <span className="text-[12px] text-text-3 block truncate">
                                {snippet.description}
                            </span>
                        </div>
                    )}
                    <span className="text-[10.5px] text-text-4 font-mono ml-auto flex-shrink-0">
                        {formatDate(new Date(snippet.createdAt))}
                    </span>
                </div>
            ) : (
                <div className="px-[24px] py-[14px] border-b border-border flex-shrink-0">
                    <div className="flex gap-[10px]">
                        {/* Fixed width — inputBase has no w-full so this works */}
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
                </div>
            )}

            {/* Code */}
            <div className="flex-1 min-w-0 overflow-auto bg-[#0d0d0d]">
                {editing ? (
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full h-full min-h-[400px] px-[24px] py-[20px] bg-transparent text-[12px] text-text-2 font-mono leading-[1.75] resize-none border-none outline-none"
                        spellCheck={false}
                    />
                ) : highlightedHtml ? (
                    <div
                        className="px-[24px] py-[20px] text-[12px] leading-[1.75]
                            [&>pre]:!bg-transparent [&>pre]:!m-0
                            [&>pre]:overflow-x-auto [&>pre]:whitespace-pre"
                        style={{
                            fontFamily: "var(--font-geist-mono), monospace",
                        }}
                        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                    />
                ) : (
                    <pre className="px-[24px] py-[20px] text-[12px] text-[#d4d4d8] font-mono leading-[1.75] overflow-x-auto whitespace-pre">
                        <code>{snippet.code}</code>
                    </pre>
                )}
            </div>
        </div>
    );
}
