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

interface Snippet {
  id: string;
  title: string;
  description: string | null;
  code: string;
  language: string;
}

export default function EditSnippetForm({ snippet }: { snippet: Snippet }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const inputClass = "w-full px-3 py-2 bg-black border border-white/10 text-sm text-white placeholder-white/30 focus:border-white/20 transition";

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const code = formData.get("code") as string;
    const language = formData.get("language") as string;

    const res = await fetch(`/api/snippets/${snippet.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, code, language }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      setLoading(false);
      return;
    }

    router.push(`/dashboard/snippets/${snippet.id}`);
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this snippet?")) return;
    setDeleting(true);

    const res = await fetch(`/api/snippets/${snippet.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      setDeleting(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-xs text-white/40 mb-2">title</label>
        <input name="title" type="text" required defaultValue={snippet.title} className={inputClass} />
      </div>

      <div>
        <label className="block text-xs text-white/40 mb-2">description</label>
        <input name="description" type="text" defaultValue={snippet.description ?? ""} className={inputClass} />
      </div>

      <div>
        <label className="block text-xs text-white/40 mb-2">language</label>
        <select name="language" required defaultValue={snippet.language} className={inputClass}>
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang} className="bg-black">
              {lang}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs text-white/40 mb-2">code</label>
        <textarea
          name="code"
          required
          rows={14}
          defaultValue={snippet.code}
          className={`${inputClass} font-mono`}
        />
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="text-xs text-black bg-white px-4 py-2 hover:bg-white/90 disabled:opacity-50 transition font-medium"
          >
            {loading ? "saving..." : "save changes"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-xs text-white/40 border border-white/10 px-4 py-2 hover:text-white hover:border-white/20 transition"
          >
            cancel
          </button>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50 transition"
        >
          {deleting ? "deleting..." : "delete snippet"}
        </button>
      </div>
    </form>
  );
}
