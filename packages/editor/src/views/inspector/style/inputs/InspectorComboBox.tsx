import { useContext } from "react";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { IconifyIcon } from "@iconify/react";
import { Input } from "../../../../components/Input";
import { Mixed, sameOrMixed } from "../../../../utils/Mixed";
import { Selectable } from "../../../../models/Selectable";
import { InspectorTargetContext } from "../../components/InspectorTargetContext";
import { projectState } from "../../../../state/ProjectState";
import { SelectOption } from "../../../../components/Select";
import { ComboBox } from "../../../../components/ComboBox";

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
