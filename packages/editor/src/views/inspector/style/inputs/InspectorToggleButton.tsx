import { observer } from "mobx-react-lite";
import { Mixed, sameOrMixed } from "../../../../utils/Mixed";
import { InspectorTargetContext } from "../../components/InspectorTargetContext";
import { useContext } from "react";
import { Selectable } from "../../../../models/Selectable";
import { projectState } from "../../../../state/ProjectState";
import { action } from "mobx";
import { IconProps } from "@iconify/react";
import { ToggleButton } from "../../../../components/ToggleButton";

export const InspectorToggleButton = observer(function InspectorCheckBox({
  className,
  get,
  set,
  icon,
  tooltip,
}: {
  className?: string;
  get: (s: Selectable) => boolean | undefined;
  set: (s: Selectable, value?: boolean) => void;
  icon: IconProps["icon"];
  tooltip: string;
}) {
  const selectables = useContext(InspectorTargetContext);
  const value = sameOrMixed(selectables.map((s) => get(s)));
  const indeterminate = value === Mixed;

  return (
    <ToggleButton
      className={className}
      value={value && !indeterminate}
      icon={icon}
      tooltip={tooltip}
      onChange={action((value) => {
        for (const selectable of selectables) {
          set(selectable, value);
        }
        projectState.undoManager.stopCapturing();
      })}
    />
  );
});
