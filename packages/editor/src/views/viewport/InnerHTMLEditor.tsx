import { popoverStyle } from "@seanchas116/paintkit/src/components/Common";
import { colors } from "@seanchas116/paintkit/src/components/Palette";
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

const TextareaWrap = styled.div`
  position: absolute;
  ${popoverStyle}
  padding: 4px;
`;

const Textarea = styled.textarea`
  display: block;
  width: 400px;
  height: 200px;
  background: ${colors.uiBackground};
  border-radius: 4px;
  color: ${colors.text};
  padding: 6px;
  font-size: 12px;
  color: ${colors.text};
  resize: both;
`;

export const InnerHTMLEditor: React.FC = observer(() => {
  const editorState = useEditorState();

  const target = editorState.innerHTMLEditTarget;

  if (!target) {
    return null;
  }

  const bbox = target.boundingBox.transform(
    editorState.scroll.documentToViewport
  );

  return (
    <InnerHTMLEditorWrap>
      <TextareaWrap
        style={{
          left: `${bbox.left}px`,
          top: `${bbox.bottom}px`,
        }}
      >
        <Textarea />
      </TextareaWrap>
    </InnerHTMLEditorWrap>
  );
});
