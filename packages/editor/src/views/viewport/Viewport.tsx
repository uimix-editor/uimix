import { colors } from "@seanchas116/paintkit/src/components/Palette";
import { Rect, Vec2 } from "paintvec";
import { action, runInAction } from "mobx";
import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import { DocumentMount } from "../../mount/DocumentMount";
import { useEditorState } from "../EditorStateContext";
import { PanOverlay } from "./PanOverlay";
import { Indicators } from "./indicators/Indicators";
import { PointerOverlay } from "./pointer/PointerOverlay";
import { FrameLabels } from "./VariantLabels";
import { InnerHTMLEditor } from "./InnerHTMLEditor";

const ViewportWrap = styled.div`
  background-color: ${colors.uiBackground};
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

      runInAction(() => {
        editorState.scroll.viewportClientRect = Rect.from(
          elem.getBoundingClientRect()
        );
      });
      const resizeObserver = new ResizeObserver(
        action(() => {
          editorState.scroll.viewportClientRect = Rect.from(
            elem.getBoundingClientRect()
          );
        })
      );
      resizeObserver.observe(elem);
      return () => resizeObserver.disconnect();
    }, [ref]);

    useEffect(() => {
      const mount = new DocumentMount(
        editorState,
        editorState.document,
        iframeWrapRef.current!
      );
      mount.iframe.style.position = "absolute";
      mount.iframe.style.top = "0";
      mount.iframe.style.left = "0";
      mount.iframe.style.width = "100%";
      mount.iframe.style.height = "100%";

      return () => {
        mount.dispose();
      };
    }, [iframeWrapRef, editorState.document]);

    const onWheel = useCallback(
      action((e: React.WheelEvent) => {
        // if (!editorState.wheelScrollEnabled) {
        //   return;
        // }

        if (e.ctrlKey || e.metaKey) {
          const factor = Math.pow(2, e.deltaY / 100);
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
      }),
      [editorState]
    );

    return (
      <ViewportWrap className={className} ref={ref} onWheel={onWheel}>
        <ViewportIFrameWrap ref={iframeWrapRef} />
        <PointerOverlay />
        <FrameLabels />
        <Indicators />
        <InnerHTMLEditor />
        <PanOverlay />
      </ViewportWrap>
    );
  }
);
