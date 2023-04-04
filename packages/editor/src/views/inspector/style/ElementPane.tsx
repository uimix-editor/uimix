import { observer } from "mobx-react-lite";
import { Mixed, sameOrMixed } from "../../../utils/Mixed";
import { projectState } from "../../../state/ProjectState";
import { InspectorHeading } from "../components/InspectorHeading";
import { InspectorPane } from "../components/InspectorPane";
import { InspectorInput } from "./inputs/InspectorInput";
import { InspectorTargetContext } from "../components/InspectorTargetContext";
import { Tooltip } from "@uimix/design-system/src/components/Tooltip";
import { Icon } from "@iconify/react";

export const ElementPane: React.FC = observer(function DebugPane() {
  const selectables = projectState.selectedSelectables;

  if (!selectables.length) {
    return null;
  }

  // TODO: auto-generate non duplicating ID for each element
  const identifier = sameOrMixed(selectables.map((s) => s.refID));

  return (
    <InspectorPane>
      <InspectorHeading icon="material-symbols:code-rounded" text="Element" />
      <InspectorTargetContext.Provider value={selectables}>
        <div className="grid grid-cols-3 gap-2 items-center">
          <label className="text-macaron-label">Tag</label>
          <InspectorInput
            get={(s) => s.style.tagName ?? undefined}
            placeholder={() => "div"}
            set={(s, value) => {
              s.style.tagName = value || null;
            }}
            className="col-span-2"
          />
          {!!identifier && (
            <>
              <label className="text-macaron-label flex items-center gap-1">
                Ref ID
                <Tooltip
                  text={
                    <>
                      Ref IDs are used to refer to elements inside components in
                      code.
                      <br />
                      Auto-generated from element names.
                    </>
                  }
                >
                  <Icon
                    icon="material-symbols:help-outline"
                    className="w-4 h-4"
                  />
                </Tooltip>
              </label>

              {identifier === Mixed ? (
                <div className="text-macaron-disabledText">Mixed</div>
              ) : (
                <code className="col-span-2 select-text">{identifier}</code>
              )}
            </>
          )}
        </div>
      </InspectorTargetContext.Provider>
    </InspectorPane>
  );
});
