"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface Snippet {
  id: string;
  title: string;
  description: string | null;
  language: string;
}

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      const timeout = setTimeout(() => {
        setResults([]);
        setOpen(false);
      }, 0);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
      setOpen(true);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  function handleSelect(id: string) {
    setQuery("");
    setOpen(false);
    router.push(`/dashboard/snippets/${id}`);
  }

  return (
    <div ref={ref} className="relative w-64">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search snippets..."
        className="w-full px-3 py-1.5 border border-gray-200 rounded-none text-sm text-gray-900 bg-white outline-none focus:border-gray-400 transition"
      />
      {loading && (
        <div className="absolute right-3 top-2 text-gray-400 text-xs">
          Searching...
        </div>
      )}
      {open && results.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 z-50 overflow-hidden">
          {results.map((snippet) => (
            <button
              key={snippet.id}
              onClick={() => handleSelect(snippet.id)}
              className="w-full text-left px-3 py-2.5 hover:bg-gray-50 transition border-b border-gray-100 last:border-0"
            >
              <p className="text-sm font-medium text-gray-900">{snippet.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-mono text-gray-400">{snippet.language}</span>
                {snippet.description && (
                  <span className="text-xs text-gray-400 truncate">{snippet.description}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
      {open && results.length === 0 && !loading && (
        <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 z-50 p-4 text-center">
          <p className="text-sm text-gray-400">No snippets found</p>
        </div>
      )}
    </div>
  );
}
