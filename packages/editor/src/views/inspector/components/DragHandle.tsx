import { twMerge } from "tailwind-merge";

export const dragHandleClass = "drag-handle";

export function DragHandle({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="28"
      viewBox="0 0 12 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={twMerge(
        `${dragHandleClass} cursor-move text-macaron-text/20`,
        className
      )}
    >
      <rect x="4" y="9" width="6" height="2" fill="currentColor" />
      <rect x="4" y="17" width="6" height="2" fill="currentColor" />
      <rect x="4" y="13" width="6" height="2" fill="currentColor" />
    </svg>
  );
}
