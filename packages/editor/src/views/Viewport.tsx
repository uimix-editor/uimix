import { colors } from "@seanchas116/paintkit/src/components/Palette";
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

  const iframeRef = React.createRef<HTMLIFrameElement>();

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) {
      return;
    }
    const document = iframe.contentDocument;
    if (!document) {
      return;
    }

    const mount = new DocumentMount(editorState.document, document);
    return () => mount.dispose();
  }, [iframeRef]);

  return (
    <ViewportWrap className={className}>
      <ViewportIFrame ref={iframeRef} />
    </ViewportWrap>
  );
};
