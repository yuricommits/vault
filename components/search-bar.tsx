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
        className="w-full px-3 py-1.5 text-xs text-white bg-black border border-white/10 focus:border-white/20 transition"
      />
      {loading && (
        <div className="absolute right-3 top-2 text-white/40 text-xs">
          searching...
        </div>
      )}
      {open && results.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-black border border-white/10 z-50 overflow-hidden">
          {results.map((snippet) => (
            <button
              key={snippet.id}
              onClick={() => handleSelect(snippet.id)}
              className="w-full text-left px-3 py-2.5 hover:bg-white/5 transition border-b border-white/5 last:border-0"
            >
              <p className="text-xs text-white">{snippet.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-white/40">{snippet.language}</span>
                {snippet.description && (
                  <span className="text-xs text-white/30 truncate">{snippet.description}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
      {open && results.length === 0 && !loading && (
        <div className="absolute top-full mt-1 w-full bg-black border border-white/10 z-50 p-4 text-center">
          <p className="text-xs text-white/40">no snippets found</p>
        </div>
      )}
    </div>
  );
}
