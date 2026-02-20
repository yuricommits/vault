import { MouseEventHandler } from "react";

interface TagBadgeProps {
  name: string;
  onRemove?: MouseEventHandler<HTMLButtonElement>;
}

export default function TagBadge({ name, onRemove }: TagBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
      {name}
      {onRemove && (
        <button
          onClick={onRemove}
          className="hover:text-red-500 transition text-gray-400 font-bold"
        >
          ×
        </button>
      )}
    </span>
  );
}
