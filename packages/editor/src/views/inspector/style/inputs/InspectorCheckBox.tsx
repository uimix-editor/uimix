import { observer } from "mobx-react-lite";
import { Mixed, sameOrMixed } from "../../../../utils/Mixed";
import { InspectorTargetContext } from "../../components/InspectorTargetContext";
import { useContext, useEffect, useRef } from "react";
import { Selectable } from "../../../../models/Selectable";
import { projectState } from "../../../../state/ProjectState";
import { twMerge } from "tailwind-merge";
import { action } from "mobx";

export const InspectorCheckBox = observer(function InspectorCheckBox({
  className,
  get,
  set,
}: {
  className?: string;
  get: (s: Selectable) => boolean | undefined;
  set: (s: Selectable, value?: boolean) => void;
}) {
  const selectables = useContext(InspectorTargetContext);
  const value = sameOrMixed(selectables.map((s) => get(s)));
  const indeterminate = value === Mixed;

  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      className={twMerge("accent-macaron-active", className)}
      ref={ref}
      checked={value === true}
      onChange={action((e) => {
        for (const selectable of selectables) {
          set(selectable, e.target.checked);
        }
        projectState.undoManager.stopCapturing();
      })}
    />
  );
});
