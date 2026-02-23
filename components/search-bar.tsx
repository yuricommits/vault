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
      setResults([]);
      setOpen(false);
      return;
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
    <div ref={ref} className="relative w-56">
      <div className="relative flex items-center">
        <span className="absolute left-3 text-white/20 text-xs pointer-events-none">/</span>
        <input
          data-search
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setOpen(true)}
          placeholder="search snippets"
          className="w-full pl-7 pr-3 py-1.5 text-xs text-white/70 bg-white/[0.03] border border-white/10 focus:border-white/20 focus:text-white placeholder-white/20 transition outline-none"
        />
        {loading && (
          <span className="absolute right-3 text-white/20 text-[10px]">...</span>
        )}
      </div>

      {open && (
        <div className="absolute top-full mt-1 w-full bg-[#0a0a0a] border border-white/10 z-50 overflow-hidden">
          {results.length > 0 ? (
            results.map((snippet) => (
              <button
                key={snippet.id}
                onClick={() => handleSelect(snippet.id)}
                className="w-full text-left px-3 py-2.5 hover:bg-white/5 transition border-b border-white/5 last:border-0"
              >
                <p className="text-xs text-white">{snippet.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-white/30 font-mono">{snippet.language}</span>
                  {snippet.description && (
                    <span className="text-[10px] text-white/20 truncate">{snippet.description}</span>
                  )}
                </div>
              </button>
            ))
          ) : (
            <div className="px-3 py-4 text-center">
              <p className="text-xs text-white/30">no snippets found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
