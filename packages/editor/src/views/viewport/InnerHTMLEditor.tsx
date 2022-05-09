import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { useEditorState } from "../EditorStateContext";

const InnerHTMLEditorWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
`;

export const InnerHTMLEditor: React.FC = observer(() => {
  const editorState = useEditorState();

  if (!editorState.innerHTMLEditTarget) {
    return null;
  }

  return <InnerHTMLEditorWrap></InnerHTMLEditorWrap>;
});
