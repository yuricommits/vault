"use client";

import { useState, useEffect } from "react";
import TagBadge from "@/components/tag-badge";

interface Tag {
  id: string;
  name: string;
}

export default function TagManager({ snippetId }: { snippetId: string }) {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [snippetTags, setSnippetTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTags();
    fetchSnippetTags();
  }, []);

  async function fetchTags() {
    const res = await fetch("/api/tags");
    const data = await res.json();
    setAllTags(data);
  }

  async function fetchSnippetTags() {
    const res = await fetch(`/api/snippets/${snippetId}/tags`);
    const data = await res.json();
    setSnippetTags(data);
  }

  async function handleAddTag(tagId: string) {
    await fetch(`/api/snippets/${snippetId}/tags`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tagId }),
    });
    await fetchSnippetTags();
  }

  async function handleRemoveTag(tagId: string) {
    await fetch(`/api/snippets/${snippetId}/tags`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tagId }),
    });
    await fetchSnippetTags();
  }

  async function handleCreateTag() {
    if (!newTag.trim()) return;
    setLoading(true);

    const res = await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newTag.trim() }),
    });

    const tag = await res.json();
    setNewTag("");
    await fetchTags();

    if (tag?.id) {
      await handleAddTag(tag.id);
    }

    setLoading(false);
  }

  const unassignedTags = allTags.filter(
    (tag) => !snippetTags.some((st) => st.id === tag.id)
  );

  const inputClass = "px-3 py-2 bg-[#111111] border border-[#1f1f1f] text-sm text-white placeholder-[#444444] focus:border-[#333333] transition outline-none";

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-[#666666] mb-2">tags</p>
        <div className="flex flex-wrap gap-2 min-h-6">
          {snippetTags.length === 0 ? (
            <p className="text-xs text-white/20">no tags yet</p>
          ) : (
            snippetTags.map((tag) => (
              <TagBadge
                key={tag.id}
                name={tag.name}
                onRemove={() => handleRemoveTag(tag.id)}
              />
            ))
          )}
        </div>
      </div>

      {unassignedTags.length > 0 && (
        <div>
          <p className="text-xs text-[#666666] mb-2">add existing tag</p>
          <div className="flex flex-wrap gap-2">
            {unassignedTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleAddTag(tag.id)}
                className="text-xs border border-white/10 text-white/40 px-2 py-1 hover:text-white hover:border-white/30 transition font-mono"
              >
                + {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreateTag()}
          placeholder="create new tag..."
          className={`flex-1 ${inputClass} font-mono`}
        />
        <button
          onClick={handleCreateTag}
          disabled={loading || !newTag.trim()}
          className="text-xs text-black bg-white px-4 py-2 hover:bg-[#ededed] disabled:opacity-50 transition font-medium"
        >
          add
        </button>
      </div>
    </div>
  );
}
