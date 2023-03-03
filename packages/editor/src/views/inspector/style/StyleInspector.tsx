import { BorderPane } from "./BorderPane";
import { DebugPane } from "./DebugPane";
import { DimensionsPane } from "./DimensionsPane";
import { ElementPane } from "./ElementPane";
import { FillPane } from "./FillPane";
import { LayoutPane } from "./LayoutPane";
import { PropertyPane } from "./PropertyPane";
import { TextPane } from "./TextPane";

export function StyleInspector(): JSX.Element {
  return (
    <div className="flex flex-col">
      <DimensionsPane />
      <LayoutPane />
      <FillPane />
      <BorderPane />
      <TextPane />
      <PropertyPane />
      <ElementPane />
      <DebugPane />
    </div>
  );
}
