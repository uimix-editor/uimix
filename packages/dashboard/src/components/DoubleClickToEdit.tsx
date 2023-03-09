import { createRef, useEffect, useState } from "react";

export function useDraftValue<T>(
  value: T,
  onChange: (value: T) => void
): [
  T, // draft
  (value: T) => void, // on change draft value
  () => void // on change done
] {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  return [draft, setDraft, () => onChange(draft)];
}

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
    <div className={className + " relative"}>
      <div
        className="h-full w-full flex items-center p-1"
        style={{
          opacity: editing ? 0 : 1,
        }}
        onDoubleClick={() => setEditing(true)}
      >
        {value}
      </div>
      {editing && (
        <input
          className="bg-white text-black outline-0 absolute inset-0
          focus:ring-1 focus:ring-blue-500 p-1 rounded
          "
          ref={inputRef}
          value={draft}
          onChange={(e) => onDraftChange(e.currentTarget.value)}
          onBlur={endEditing}
        />
      )}
    </div>
  );
}
