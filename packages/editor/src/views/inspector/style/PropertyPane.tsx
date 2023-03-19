import { observer } from "mobx-react-lite";
import { projectState } from "../../../state/ProjectState";
import { InspectorHeading } from "../components/InspectorHeading";
import { InspectorPane } from "../components/InspectorPane";
import { InspectorTargetContext } from "../components/InspectorTargetContext";
import { ForeignComponentManager } from "../../../models/ForeignComponentManager";
import { Input } from "../../../components/Input";
import { Select } from "../../../components/Select";
import { ForeignComponentRef } from "@uimix/node-data";
import { action } from "mobx";
import { Tooltip } from "../../../components/Tooltip";
import { Prop } from "../../../types/ForeignComponent";

export const PropertyPane: React.FC = observer(function PropertyPane() {
  const selectables = projectState.selectedSelectables.filter(
    (s) => s.node.type === "foreign"
  );

  if (!selectables.length) {
    return null;
  }

  // TODO: multiple components
  const selectable = selectables[0];
  const componentID = selectable.style.foreignComponent;
  const component = componentID
    ? ForeignComponentManager.global?.get(componentID)
    : undefined;

  return (
    <InspectorPane>
      <InspectorHeading
        icon="material-symbols:code"
        iconClassName="text-pink-500"
        text={component?.name ?? "Properties"}
      />
      <InspectorTargetContext.Provider value={selectables}>
        <div className="grid grid-cols-3 gap-2 items-center">
          {(component?.props ?? []).map((prop) => {
            return (
              <>
                <Tooltip text={prop.name}>
                  <label className="text-macaron-label text-ellipsis overflow-hidden">
                    {prop.name}
                  </label>
                </Tooltip>
                <PropertyEdit
                  className="col-span-2"
                  prop={prop}
                  value={componentID?.props?.[prop.name]}
                  onValueChange={action((value) => {
                    const oldComponentID = selectable.style.foreignComponent;
                    if (!oldComponentID) {
                      return;
                    }
                    const componentID: ForeignComponentRef = {
                      ...oldComponentID,
                      props: {
                        ...oldComponentID.props,
                        [prop.name]: value,
                      },
                    };
                    selectable.style.foreignComponent = componentID;
                  })}
                />
              </>
            );
          })}
        </div>
      </InspectorTargetContext.Provider>
    </InspectorPane>
  );
});

const PropertyEdit: React.FC<{
  prop: Prop;
  value: unknown;
  className?: string;
  onValueChange: (value: unknown) => void;
}> = ({ prop, value, className, onValueChange }) => {
  if (prop.type.type === "string") {
    return (
      <Input
        className={className}
        value={value ? String(value) : ""}
        onChange={(value) => onValueChange(value)}
      />
    );
  }
  if (prop.type.type === "boolean") {
    // return (
    //   <input
    //     type="checkbox"
    //     onChange={(e) => onValueChange(e.target.checked)}
    //   />
    // );
    return (
      <Select
        className={className}
        options={[
          { value: "", text: "" },
          { value: "false", text: "false" },
          { value: "true", text: "true" },
        ]}
        value={value === true ? "true" : value === false ? "false" : ""}
        onChange={(value) =>
          onValueChange(
            value === "true" ? true : value === "false" ? false : undefined
          )
        }
      />
    );
  }
  if (prop.type.type === "enum") {
    return (
      <Select
        className={className}
        options={prop.type.values.map((value) => {
          try {
            return {
              value: value,
              text: value,
            };
          } catch {
            return {
              value: "",
              text: "",
            };
          }
        })}
        value={value as string}
        onChange={(value) => onValueChange(value || undefined)}
      />
    );
  }
  return <div></div>;
};
