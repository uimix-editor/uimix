import { observer } from "mobx-react-lite";
import { Mixed, sameOrMixed } from "../../../../utils/Mixed";
import { InspectorTargetContext } from "../../components/InspectorTargetContext";
import { useContext } from "react";
import { Selectable } from "../../../../models/Selectable";
import { projectState } from "../../../../state/ProjectState";
import { action } from "mobx";
import { IconButton } from "../../../../components/IconButton";
import { IconProps } from "@iconify/react";
import { Tooltip } from "../../../../components/Tooltip";

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
    <Tooltip text={tooltip}>
      <IconButton
        className={className}
        aria-pressed={value && !indeterminate}
        icon={icon}
        onClick={action((e) => {
          for (const selectable of selectables) {
            set(selectable, !value);
          }
          projectState.undoManager.stopCapturing();
        })}
      />
    </Tooltip>
  );
});
