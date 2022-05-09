import { colors } from "@seanchas116/paintkit/src/components/Palette";
import { Rect, Vec2 } from "paintvec";
import { action, reaction, runInAction } from "mobx";
import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
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

const ViewportIFrame = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
`;

export const Viewport: React.FC<{ className?: string }> = ({ className }) => {
  const editorState = useEditorState();

  const ref = React.createRef<HTMLDivElement>();
  const iframeRef = React.createRef<HTMLIFrameElement>();

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
    const iframe = iframeRef.current;
    if (!iframe) {
      return;
    }
    const document = iframe.contentDocument;
    if (!document) {
      return;
    }
    editorState.elementPicker.root = document;

    document.body.style.margin = "0";

    const mount = new DocumentMount(editorState, document);
    mount.dom.style.position = "absolute";
    mount.dom.style.top = "0";
    mount.dom.style.left = "0";
    mount.dom.style.transformOrigin = "left top";

    const disposer = reaction(
      () => editorState.scroll.documentToViewport,
      (transform) => {
        mount.dom.style.transform = transform.toCSSMatrixString();
      }
    );

    document.body.append(mount.dom);

    return () => {
      disposer();
      mount.dom.remove();
      mount.dispose();
    };
  }, [iframeRef]);

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
      <ViewportIFrame ref={iframeRef} />
      <PointerOverlay />
      <FrameLabels />
      <Indicators />
      <InnerHTMLEditor />
      <PanOverlay />
    </ViewportWrap>
  );
};
