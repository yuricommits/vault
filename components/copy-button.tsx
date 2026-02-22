"use client";

import { useState } from "react";

export default function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="text-xs text-white/40 border border-white/10 px-3 py-1.5 hover:text-white hover:border-white/20 transition"
    >
      {copied ? "copied!" : "copy"}
    </button>
  );
}
