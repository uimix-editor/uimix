import { useContext } from "react";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { IconifyIcon } from "@iconify/react";
import { Input } from "@uimix/foundation/src/components/Input";
import { Mixed, sameOrMixed } from "@uimix/foundation/src/utils/Mixed";
import { Selectable } from "../../../../models/Selectable";
import { InspectorTargetContext } from "../../components/InspectorTargetContext";
import { projectState } from "../../../../state/ProjectState";

export const InspectorInput = observer(function InspectorInput({
  className,
  get,
  set,
  placeholder: getPlaceholder,
  icon,
}: {
  className?: string;
  get: (selectable: Selectable) => string | undefined;
  set: (selectable: Selectable, value?: string) => void;
  placeholder?: (selectable: Selectable) => string | undefined;
  icon?: string | IconifyIcon;
}) {
  const selectables = useContext(InspectorTargetContext);
  const value = sameOrMixed(selectables.map((s) => get(s)));
  const placeholder = sameOrMixed(selectables.map((s) => getPlaceholder?.(s)));

  return (
    <Input
      icon={icon}
      className={className}
      value={value}
      placeholder={placeholder === Mixed ? undefined : placeholder}
      onChange={action((value: string) => {
        for (const selectable of selectables) {
          set(selectable, value);
        }
        projectState.undoManager.stopCapturing();
      })}
    />
  );
});
