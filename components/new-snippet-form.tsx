"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

export default function NewSnippetForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const code = formData.get("code") as string;
    const language = formData.get("language") as string;

    const res = await fetch("/api/snippets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, code, language }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  const inputClass = "w-full px-3 py-2 bg-[#111111] border border-[#1f1f1f] text-sm text-white placeholder-[#444444] focus:border-[#333333] transition";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-xs text-[#666666] mb-2">title</label>
        <input
          name="title"
          type="text"
          required
          className={inputClass}
          placeholder="e.g. Fetch with error handling"
        />
      </div>

      <div>
        <label className="block text-xs text-[#666666] mb-2">description</label>
        <input
          name="description"
          type="text"
          className={inputClass}
          placeholder="Brief description of what this snippet does"
        />
      </div>

      <div>
        <label className="block text-xs text-[#666666] mb-2">language</label>
        <select
          name="language"
          required
          className={inputClass}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang} className="bg-[#111111]">
              {lang}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs text-[#666666] mb-2">code</label>
        <textarea
          name="code"
          required
          rows={14}
          className={`${inputClass} font-mono`}
          placeholder="Paste your code here..."
        />
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
