import { BorderPane } from "./BorderPane";
import { DebugPane } from "./DebugPane";
import { DimensionsPane } from "./DimensionsPane";
import { ElementPane } from "./ElementPane";
import { FillPane } from "./FillPane";
import { ImagePane } from "./ImagePane";
import { LayoutPane } from "./LayoutPane";
import { PropertyPane } from "./PropertyPane";
import { SVGPane } from "./SVGPane";
import { ShadowPane } from "./ShadowPane";
import { TextPane } from "./TextPane";

export function StyleInspector(): JSX.Element {
  return (
    <div className="flex flex-col">
      <DimensionsPane />
      <LayoutPane />
      <FillPane />
      <BorderPane />
      <ShadowPane />
      <TextPane />
      <PropertyPane />
      <ImagePane />
      <SVGPane />
      <ElementPane />
      <DebugPane />
    </div>
  );
}
