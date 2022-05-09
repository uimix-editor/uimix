import { popoverStyle } from "@seanchas116/paintkit/src/components/Common";
import { colors } from "@seanchas116/paintkit/src/components/Palette";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import styled from "styled-components";
import { toHtml } from "hast-util-to-html";
import { ElementInstance } from "../../models/ElementInstance";
import { useEditorState } from "../EditorStateContext";
import { formatHTML } from "../../util/Format";
import { parseHTMLFragment } from "../../util/Hast";

const InnerHTMLEditorWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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

export const InnerHTMLEditorBody: React.FC<{
  target: ElementInstance;
}> = observer(({ target }) => {
  const editorState = useEditorState();

  const bbox = target.boundingBox.transform(
    editorState.scroll.documentToViewport
  );

  const [value, setValue] = useState(() => {
    return formatHTML(toHtml(target.element.innerHTML));
  });

  return (
    <InnerHTMLEditorWrap>
      <Background
        onClick={() => {
          editorState.innerHTMLEditTarget = undefined;
        }}
      />
      <TextareaWrap
        style={{
          left: `${bbox.left}px`,
          top: `${bbox.bottom}px`,
        }}
      >
        <Textarea
          value={value}
          onChange={(e) => {
            const value = e.target.value;
            setValue(value);

            const node = parseHTMLFragment(value);
            target.setInnerHTML(node.children);
          }}
        />
      </TextareaWrap>
    </InnerHTMLEditorWrap>
  );
});

export const InnerHTMLEditor: React.FC = observer(() => {
  const editorState = useEditorState();
  const target = editorState.innerHTMLEditTarget;
  if (!target) {
    return null;
  }
  return <InnerHTMLEditorBody target={target} />;
});
