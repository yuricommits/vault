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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                </label>
                <input
                    name="title"
                    type="text"
                    required
                    defaultValue={snippet.title}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                </label>
                <input
                    name="description"
                    type="text"
                    defaultValue={snippet.description ?? ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                </label>
                <select
                    name="language"
                    required
                    defaultValue={snippet.language}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none"
                >
                    {LANGUAGES.map((lang) => (
                        <option key={lang} value={lang}>
                            {lang}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code
                </label>
                <textarea
                    name="code"
                    required
                    rows={12}
                    defaultValue={snippet.code}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 font-mono focus:outline-none"
                />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex items-center justify-between">
                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                </div>
                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50 transition"
                >
                    {deleting ? "Deleting..." : "Delete Snippet"}
                </button>
            </div>
        </form>
    );
}
