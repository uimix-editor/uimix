import { useEffect, useState } from "react";

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
