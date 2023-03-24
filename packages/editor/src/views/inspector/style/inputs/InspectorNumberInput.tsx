import { observer } from "mobx-react-lite";
import { Input } from "../../../../components/Input";
import { sameOrMixed } from "../../../../utils/Mixed";
import { action } from "mobx";
import { IconifyIcon } from "@iconify/react";
import { useContext } from "react";
import { InspectorTargetContext } from "../../components/InspectorTargetContext";
import { Selectable } from "../../../../models/Selectable";
import { projectState } from "../../../../state/ProjectState";
import { roundToFixed } from "../../../../utils/Math";

export const InspectorNumberInput = observer(function InspectorNumberInput({
  className,
  get,
  set,
  allowedUnits,
  placeholder: getPlaceholder,
  icon,
  tooltip,
}: {
  className?: string;
  get: (selectable: Selectable) => { value: number; unit?: string } | undefined;
  set: (
    selectable: Selectable,
    value?: {
      value: number;
      unit?: string;
    }
  ) => void;
  allowedUnits?: string[];
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
      value={
        typeof value === "object"
          ? String(roundToFixed(value.value, 2)) + (value.unit ?? "")
          : value
      }
      placeholder={
        typeof placeholder === "number"
          ? String(roundToFixed(placeholder, 2))
          : undefined
      }
      onChange={action((valueText: string) => {
        const dim = parseDimension(valueText, allowedUnits);
        for (const selectable of selectables) {
          set(selectable, dim);
        }
        projectState.undoManager.stopCapturing();
      })}
    />
  );
});

function parseDimension(
  text: string,
  allowedUnits?: string[]
):
  | {
      value: number;
      unit?: string;
    }
  | undefined {
  const value = Number.parseFloat(text);

  if (Number.isNaN(value)) {
    return;
  }

  let unit = text.replace(/^-?\d*\.?\d*/, "") || undefined;
  if (unit && !allowedUnits?.includes(unit)) {
    unit = undefined;
  }

  return { value, unit };
}
