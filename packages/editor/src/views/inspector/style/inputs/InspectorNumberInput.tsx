import { observer } from "mobx-react-lite";
import { action } from "mobx";
import { IconifyIcon } from "@iconify/react";
import { useContext } from "react";
import { Input } from "@uimix/foundation/src/components";
import { sameOrMixed } from "@uimix/foundation/src/utils/Mixed";
import { roundToFixed } from "@uimix/foundation/src/utils/Math";
import { InspectorTargetContext } from "../../components/InspectorTargetContext";
import { Selectable } from "@uimix/model/src/models";
import { projectState } from "../../../../state/ProjectState";

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
  placeholder?: (selectable: Selectable) => number | string | undefined;
  icon?: React.ReactNode | IconifyIcon;
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
          : typeof placeholder === "string"
          ? placeholder
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
