import { MouseEventHandler } from "react";

interface TagBadgeProps {
  name: string;
  onRemove?: MouseEventHandler<HTMLButtonElement>;
}

export default function TagBadge({ name, onRemove }: TagBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 bg-white/5 text-white/60 border border-white/10 px-2 py-1 text-xs font-mono">
      {name}
      {onRemove && (
        <button
          onClick={onRemove}
          className="hover:text-white transition text-white/30 font-bold"
        >
          ×
        </button>
      )}
    </span>
  );
}
