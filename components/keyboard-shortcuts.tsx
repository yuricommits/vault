"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function KeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName.toLowerCase();
      const isTyping = tag === "input" || tag === "textarea" || tag === "select";

      if (e.key === "Escape") {
        (document.activeElement as HTMLElement)?.blur();
        return;
      }

      if (isTyping) return;

      if (e.key === "n") {
        e.preventDefault();
        router.push("/dashboard/snippets/new");
        return;
      }

      if (e.key === "/") {
        e.preventDefault();
        const search = document.querySelector<HTMLInputElement>("[data-search]");
        search?.focus();
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return null;
}
