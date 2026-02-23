"use client";
import { X, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AIPromo({ onClose }: { onClose: () => void }) {
    return (
        <div className="h-full flex flex-col items-center justify-center px-[48px] text-center gap-0 relative">
            <button
                onClick={onClose}
                className="absolute top-[20px] right-[20px] text-text-4 hover:text-text-1 transition-colors p-[4px]"
            >
                <X size={15} />
            </button>

            <div className="w-[48px] h-[48px] border border-border-2 rounded-md flex items-center justify-center text-text-3 bg-bg-1 mb-[20px]">
                <Sparkles size={20} />
            </div>

            <h2 className="text-[16px] font-semibold text-text-1 tracking-[-0.03em] mb-[8px]">
                Enhance with AI
            </h2>
            <p className="text-[12.5px] text-text-3 leading-[1.75] max-w-[320px] mb-[24px]">
                Paste raw code and Claude generates a title, description, tags,
                and improved code automatically. Add your Anthropic API key in
                settings to get started.
            </p>

            <div className="flex items-center gap-[8px]">
                <Link
                    href="/dashboard/snippets/new"
                    className="btn btn-solid text-[12px]"
                >
                    <Sparkles size={12} />
                    new snippet
                </Link>
                <Link
                    href="/dashboard/settings"
                    className="btn btn-outline text-[12px]"
                >
                    settings
                </Link>
            </div>

            <p className="text-[10.5px] text-text-4 font-mono mt-[32px]">
                powered by Claude · bring your own key
            </p>
        </div>
    );
}
