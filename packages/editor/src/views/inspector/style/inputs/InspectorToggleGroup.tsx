import { observer } from "mobx-react-lite";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@uimix/foundation/src/components/ToggleGroup";
import { Mixed, sameOrMixed } from "@uimix/foundation/src/utils/Mixed";
import { InspectorTargetContext } from "../../components/InspectorTargetContext";
import { useContext } from "react";
import { Selectable } from "../../../../models/Selectable";
import { projectState } from "../../../../state/ProjectState";

export const InspectorToggleGroup = observer(function InspectorToggleGroup<
  T extends string
>({
  className,
  get,
  set,
  items,
}: {
  className?: string;
  get: (s: Selectable) => T | undefined;
  set: (s: Selectable, value?: T) => void;
  items: ToggleGroupItem<T>[];
}) {
  const selectables = useContext(InspectorTargetContext);
  const value = sameOrMixed(selectables.map((s) => get(s)));

  return (
    <ToggleGroup
      value={value === Mixed ? undefined : value}
      className={className}
      items={items}
      onChange={(value) => {
        for (const selectable of selectables) {
          set(selectable, value);
        }
        projectState.undoManager.stopCapturing();
      }}
    />
  );
});
