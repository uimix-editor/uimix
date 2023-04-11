import { useContext } from "react";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { IconifyIcon } from "@iconify/react";
import { Mixed, sameOrMixed } from "@uimix/foundation/src/utils/Mixed";
import { Selectable } from "@uimix/model/src/models";
import { InspectorTargetContext } from "../../components/InspectorTargetContext";
import { projectState } from "../../../../state/ProjectState";
import { SelectOption } from "@uimix/foundation/src/components/Select";
import { ComboBox } from "@uimix/foundation/src/components/ComboBox";

export const InspectorComboBox = observer(function InspectorComboBox({
  className,
  get,
  set,
  icon,
  options,
}: {
  className?: string;
  get: (selectable: Selectable) => string | undefined;
  set: (selectable: Selectable, value?: string) => void;
  icon?: string | IconifyIcon;
  options: readonly SelectOption<string>[];
}) {
  const selectables = useContext(InspectorTargetContext);
  const value = sameOrMixed(selectables.map((s) => get(s)));

  return (
    <ComboBox
      icon={icon}
      className={className}
      value={value === Mixed ? undefined : value}
      placeholder={value === Mixed ? "Mixed" : undefined}
      options={options}
      onChange={action((value: string) => {
        for (const selectable of selectables) {
          set(selectable, value);
        }
        projectState.undoManager.stopCapturing();
      })}
    />
  );
});
