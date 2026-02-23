"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast";

const LANGUAGES = [
  "javascript", "typescript", "python", "rust", "go", "java",
  "css", "html", "bash", "sql", "json", "markdown",
];

export default function NewSnippetForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");

  useEffect(() => {
    fetch("/api/ai/usage")
      .then((res) => res.json())
      .then((data) => setRemaining(data.remaining ?? 0));
  }, []);

  async function handleEnhance() {
    if (!code.trim()) {
      setAiError("Paste some code first before enhancing.");
      return;
    }

    setAiError(null);
    setEnhancing(true);

    try {
      const res = await fetch("/api/ai/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAiError(data.error || "Enhancement failed. You can fill in the details manually.");
        if (res.status === 429) setRemaining(0);
        return;
      }

      if (data.title) setTitle(data.title);
      if (data.description) setDescription(data.description);
      if (data.improvedCode) setCode(data.improvedCode);
      if (data.language && LANGUAGES.includes(data.language)) setLanguage(data.language);
      if (typeof data.remaining === "number") setRemaining(data.remaining);
      toast("snippet enhanced");
    } catch {
      setAiError("Enhancement failed. You can fill in the details manually.");
    } finally {
      setEnhancing(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/snippets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, code, language }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      toast(data.message || "failed to save snippet", "error");
      setLoading(false);
      return;
    }

    toast("snippet saved");
    router.push("/dashboard");
  }

  const inputClass =
    "w-full px-3 py-2 bg-[#111111] border border-[#1f1f1f] text-sm text-white placeholder-[#444444] focus:border-[#333333] transition outline-none";

  const limitReached = remaining !== null && remaining <= 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-xs text-[#666666] mb-2">code</label>
        <textarea
          required
          rows={14}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className={`${inputClass} font-mono`}
          placeholder="Paste your code here..."
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative group">
          <button
            type="button"
            onClick={handleEnhance}
            disabled={enhancing || limitReached}
            className="text-xs text-white border border-white/20 px-4 py-2 hover:border-white/50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {enhancing ? "enhancing..." : "✦ enhance with AI"}
          </button>
          {limitReached && (
            <div className="absolute bottom-full left-0 mb-2 w-56 px-3 py-2 bg-[#1a1a1a] border border-white/10 text-xs text-white/50 pointer-events-none opacity-0 group-hover:opacity-100 transition">
              Daily limit reached (10/10). Resets at midnight.
            </div>
          )}
        </div>
        {remaining !== null && !limitReached && (
          <span className="text-xs text-white/20 font-mono">{remaining} left today</span>
        )}
        {aiError && <p className="text-xs text-red-400">{aiError}</p>}
      </div>

      <div>
        <label className="block text-xs text-[#666666] mb-2">title</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
          placeholder="e.g. Fetch with error handling"
        />
      </div>

      <div>
        <label className="block text-xs text-[#666666] mb-2">description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
          placeholder="Brief description of what this snippet does"
        />
      </div>

      <div>
        <label className="block text-xs text-[#666666] mb-2">language</label>
        <select
          required
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className={inputClass}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang} className="bg-[#111111]">
              {lang}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="text-xs text-black bg-white px-4 py-2 hover:bg-[#ededed] disabled:opacity-50 transition font-medium"
        >
          {loading ? "saving..." : "save snippet"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-xs text-[#666666] border border-[#1f1f1f] px-4 py-2 hover:text-white hover:border-[#333333] transition"
        >
          cancel
        </button>
      </div>
    </form>
  );
}
