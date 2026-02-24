"use client";
import { useEffect } from "react";

export default function KeyboardShortcuts() {
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            const tag = (e.target as HTMLElement).tagName.toLowerCase();
            const isTyping =
                tag === "input" || tag === "textarea" || tag === "select";

            // Cmd+K or Ctrl+K — open search palette
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                window.dispatchEvent(new Event("open-search"));
                return;
            }

            if (e.key === "Escape") {
                (document.activeElement as HTMLElement)?.blur();
                return;
            }

            if (isTyping) return;

            // / key — open search palette
            if (e.key === "/") {
                e.preventDefault();
                window.dispatchEvent(new Event("open-search"));
                return;
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return null;
}
