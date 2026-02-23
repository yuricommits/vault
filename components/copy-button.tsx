"use client";

import { useToast } from "@/components/toast";

export default function CopyButton({ code }: { code: string }) {
  const { toast } = useToast();

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    toast("copied to clipboard");
  }

  return (
    <button
      onClick={handleCopy}
      className="text-xs text-white/40 border border-white/10 px-3 py-1.5 hover:text-white hover:border-white/20 transition"
    >
      copy
    </button>
  );
}
