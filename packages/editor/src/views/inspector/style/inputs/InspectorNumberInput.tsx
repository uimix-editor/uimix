import { observer } from "mobx-react-lite";
import { Input } from "../../../../components/Input";
import { sameOrMixed } from "../../../../utils/Mixed";
import { action } from "mobx";
import { IconifyIcon } from "@iconify/react";
import { useContext } from "react";
import { InspectorTargetContext } from "../../components/InspectorTargetContext";
import { Selectable } from "../../../../models/Selectable";
import { projectState } from "../../../../state/ProjectState";

export const InspectorNumberInput = observer(function InspectorNumberInput({
  className,
  get,
  set,
  placeholder: getPlaceholder,
  icon,
  tooltip,
}: {
  className?: string;
  get: (selectable: Selectable) => number | undefined;
  set: (selectable: Selectable, value?: number) => void;
  placeholder?: (selectable: Selectable) => number | undefined;
  icon?: string | IconifyIcon;
  tooltip?: React.ReactNode;
}) {
  const selectables = useContext(InspectorTargetContext);
  const value = sameOrMixed(selectables.map((s) => get(s)));
  const placeholder = sameOrMixed(selectables.map((s) => getPlaceholder?.(s)));

  return (
    <Input
      icon={icon}
      tooltip={tooltip}
      className={className}
      value={typeof value === "number" ? String(value) : value}
      placeholder={
        typeof placeholder === "number" ? String(placeholder) : undefined
      }
      onChange={action((valueText: string) => {
        let value = valueText ? Number.parseFloat(valueText) : undefined;
        if (Number.isNaN(value)) {
          value = undefined;
        }
        for (const selectable of selectables) {
          set(selectable, value);
        }
        projectState.undoManager.stopCapturing();
      })}
    />
  );
});
