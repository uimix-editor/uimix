import { createRef, useEffect, useState } from "react";
import { useDraftValue } from "./hooks/useDraftValue";

export function DoubleClickToEdit({
  className,
  value,
  onChange,
}: {
  className?: string;
  value: string;
  onChange: (value: string) => void;
}): JSX.Element {
  const [draft, onDraftChange, onDraftChangeDone] = useDraftValue(
    value,
    onChange
  );
  const [editing, setEditing] = useState(false);
  const inputRef = createRef<HTMLInputElement>();

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const endEditing = () => {
    setEditing(false);
    onDraftChangeDone?.();
  };

  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      input.addEventListener("change", endEditing);
      return () => {
        input.removeEventListener("change", endEditing);
      };
    }
  }, [inputRef, endEditing]);
  return (
    <div className={className}>
      {editing ? (
        <input
          className="bg-white text-black outline-0 h-full w-full"
          ref={inputRef}
          value={draft}
          onChange={(e) => onDraftChange(e.currentTarget.value)}
          onBlur={endEditing}
        />
      ) : (
        <div
          className="h-full w-full min-w-0 flex items-center truncate"
          onDoubleClick={() => setEditing(true)}
        >
          {value}
        </div>
      )}
    </div>
  );
}
