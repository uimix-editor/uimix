import { colors } from "@seanchas116/paintkit/src/components/Palette";
import { Rect } from "paintvec";
import { action, reaction, runInAction } from "mobx";
import React, { useEffect } from "react";
import styled from "styled-components";
import { DocumentMount } from "../mount/DocumentMount";
import { useEditorState } from "./EditorStateContext";

const ViewportWrap = styled.div`
  background-color: ${colors.uiBackground};
  position: relative;
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

    document.body.style.margin = "0";

    const mount = new DocumentMount(() => editorState.document, document);
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

  return (
    <ViewportWrap className={className} ref={ref}>
      <ViewportIFrame ref={iframeRef} />
    </ViewportWrap>
  );
};
