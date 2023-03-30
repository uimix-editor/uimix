import { Icon } from "@iconify/react";
import { BorderPane } from "./BorderPane";
import { DebugPane } from "./DebugPane";
import { DimensionsPane } from "./DimensionsPane";
import { ElementPane } from "./ElementPane";
import { FillPane } from "./FillPane";
import { LayoutPane } from "./LayoutPane";
import { PropertyPane } from "./PropertyPane";
import { ShadowPane } from "./ShadowPane";
import { TextPane } from "./TextPane";

export function StyleInspector(): JSX.Element {
  return (
    <div className="flex flex-col">
      <div className="flex p-3 border-b border-macaron-uiBackground">
        <div className="bg-macaron-active rounded-full px-2 py-1 text-xs text-macaron-activeText font-medium">
          Hover
        </div>
        <div className="rounded-full px-2 py-1 text-xs text-macaron-label font-medium">
          Active
        </div>
        <div className="rounded-full px-2 py-1 text-xs text-macaron-label font-medium">
          Focus
        </div>
      </div>
      <div
        className="
      bg-purple-500 text-white p-3 font-medium flex items-center
      "
      >
        Button_1 › Hover
        <button className="border bg-white p-1 rounded-full ml-auto">
          <Icon
            icon="material-symbols:close"
            className="font-xs text-purple-500"
          />
        </button>
      </div>
      <DimensionsPane />
      <LayoutPane />
      <FillPane />
      <BorderPane />
      <ShadowPane />
      <TextPane />
      <PropertyPane />
      <ElementPane />
      <DebugPane />
    </div>
  );
}
