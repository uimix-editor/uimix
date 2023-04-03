import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { Rect, Vec2 } from "paintvec";
import { createRef, useEffect } from "react";
import { projectState } from "../../state/ProjectState";
import { viewportGeometry } from "../../state/ScrollState";
import { PanOverlay } from "./PanOverlay";
import { DragHandlerOverlay } from "./dragHandler/DragHandlerOverlay";
import { HUD } from "./hud/HUD";
import { TextEditor } from "./TextEditor";
import { ComponentSections, VariantLabels } from "./VariantLabels";
import { RenderIFrame } from "./renderer/RenderIFrame";
import { ZoomControlController } from "./FloatingZoomControl";

export const Viewport: React.FC = observer(function Viewport() {
  const ref = createRef<HTMLDivElement>();

  useEffect(() => {
    const elem = ref.current;
    if (!elem) {
      return;
    }

    const updateViewportClientRect = action(() => {
      console.log("update viewport");
      viewportGeometry.domClientRect = Rect.from(elem.getBoundingClientRect());
    });

    updateViewportClientRect();

    const resizeObserver = new ResizeObserver(updateViewportClientRect);
    resizeObserver.observe(elem);

    window.addEventListener("scroll", updateViewportClientRect);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", updateViewportClientRect);
    };
  }, []);

  const onWheel = action((e: React.WheelEvent) => {
    const { scroll } = projectState;

    if (e.ctrlKey || e.metaKey) {
      const factor = Math.pow(2, -e.deltaY / 100);
      const pos = new Vec2(e.clientX, e.clientY).sub(
        viewportGeometry.domClientRect.topLeft
      );
      scroll.zoomAround(pos, scroll.scale * factor);

      if (!projectState.page?.node.childCount) {
        // No layers in page
        scroll.setTranslation(new Vec2(0));
      }
    } else {
      if (!projectState.page?.node.childCount) {
        // No layers in page
        return;
      }
      scroll.setTranslation(
        scroll.translation.sub(new Vec2(e.deltaX, e.deltaY).round)
      );
    }
  });

  return (
    <div
      ref={ref}
      className="flex-1 bg-macaron-viewportBackground relative overflow-hidden contain-strict"
      onWheel={onWheel}
    >
      <ComponentSections />
      <RenderIFrame />
      <DragHandlerOverlay />
      <VariantLabels />
      <HUD />
      <TextEditor />
      <PanOverlay />
      <ZoomControlController className="absolute bottom-3 left-1/2 transform -translate-x-1/2 shadow-lg" />
    </div>
  );
});
