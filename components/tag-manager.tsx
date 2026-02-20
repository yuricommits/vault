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

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Tags</p>
        <div className="flex flex-wrap gap-2 min-h-6">
          {snippetTags.length === 0 ? (
            <p className="text-xs text-gray-400">No tags yet</p>
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
          <p className="text-xs text-gray-500 mb-2">Add existing tag</p>
          <div className="flex flex-wrap gap-2">
            {unassignedTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleAddTag(tag.id)}
                className="text-xs bg-white border border-gray-300 text-gray-600 px-2 py-1 rounded-md hover:bg-gray-50 transition"
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
          placeholder="Create new tag..."
          className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button
          onClick={handleCreateTag}
          disabled={loading || !newTag.trim()}
          className="bg-black text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition"
        >
          Add
        </button>
      </div>
    </div>
  );
}
