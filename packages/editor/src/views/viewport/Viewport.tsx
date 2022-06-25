import { colors } from "@seanchas116/paintkit/src/components/Palette";
import { Rect, Vec2 } from "paintvec";
import { action } from "mobx";
import React, { useEffect } from "react";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import { checkPattern } from "@seanchas116/paintkit/src/components/Common";
import { DocumentMount } from "../../mount/DocumentMount";
import { useEditorState } from "../useEditorState";
import { PanOverlay } from "./PanOverlay";
import { Indicators } from "./indicators/Indicators";
import { PointerOverlay } from "./pointer/PointerOverlay";
import { FrameLabels } from "./VariantLabels";
import { InnerHTMLEditor } from "./InnerHTMLEditor";
import { ScrollBars } from "./ScrollBars";

const ViewportWrap = styled.div`
  ${checkPattern(
    colors.background,
    colors.uiBackground,
    "16px",
    "var(--checkOffsetX)",
    "var(--checkOffsetY)"
  )}

  position: relative;
  overflow: hidden;
  contain: strict;
`;

const ViewportIFrameWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export const Viewport: React.FC<{ className?: string }> = observer(
  ({ className }) => {
    const editorState = useEditorState();

    const ref = React.createRef<HTMLDivElement>();
    const iframeWrapRef = React.createRef<HTMLDivElement>();

    useEffect(() => {
      const elem = ref.current;
      if (!elem) {
        return;
      }

      const updateViewportClientRect = action(() => {
        editorState.scroll.viewportClientRect = Rect.from(
          elem.getBoundingClientRect()
        );
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

    useEffect(() => {
      const mount = new DocumentMount(
        editorState,
        editorState.document,
        iframeWrapRef.current!
      );

      return () => {
        mount.dispose();
      };
    }, [editorState.document]);

    useEffect(() => {
      const elem = ref.current;
      if (!elem) {
        return;
      }

      const onWheel = action((e: WheelEvent) => {
        if (!editorState.wheelScrollEnabled) {
          return;
        }

        e.preventDefault();

        if (e.ctrlKey || e.metaKey) {
          const factor = Math.pow(2, -e.deltaY / 100);
          const pos = new Vec2(e.clientX, e.clientY).sub(
            editorState.scroll.viewportClientRect.topLeft
          );
          editorState.scroll.zoomAround(pos, editorState.scroll.scale * factor);

          if (!editorState.document.components.firstChild) {
            // No layers in page
            editorState.scroll.translation = new Vec2(0);
          }
        } else {
          if (!editorState.document.components.firstChild) {
            // No layers in page
            return;
          }
          const { scroll } = editorState;
          scroll.translation = scroll.translation.sub(
            new Vec2(e.deltaX, e.deltaY).round
          );
        }
      });

      elem.addEventListener("wheel", onWheel);
      return () => {
        elem.removeEventListener("wheel", onWheel);
      };
    }, [editorState]);

    return (
      <ViewportWrap
        className={className}
        ref={ref}
        style={{
          ["--checkOffsetX" as keyof React.CSSProperties]: `${editorState.scroll.translation.x}px`,
          ["--checkOffsetY" as keyof React.CSSProperties]: `${editorState.scroll.translation.y}px`,
        }}
      >
        <ViewportIFrameWrap ref={iframeWrapRef} />
        <PointerOverlay />
        <FrameLabels />
        <Indicators />
        <InnerHTMLEditor />
        <PanOverlay />
        <ScrollBars />
      </ViewportWrap>
    );
  }
);
