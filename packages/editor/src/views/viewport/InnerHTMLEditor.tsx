import React, { useEffect } from "react";
import {
  popoverStyle,
  monospaceFontFamily,
} from "@seanchas116/paintkit/src/components/Common";
import { useViewModel } from "@seanchas116/paintkit/src/components/hooks/useViewModel";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { toHtml } from "hast-util-to-html";
import { action, computed, makeObservable, observable, reaction } from "mobx";
import { Rect } from "paintvec";
import type * as hast from "hast";
import { isEqual } from "lodash-es";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material-darker.css";
import "codemirror/mode/xml/xml";
import CodeMirror from "codemirror";
import { ElementInstance } from "../../models/ElementInstance";
import { useEditorState } from "../EditorStateContext";
import { formatHTML } from "../../util/Format";
import { parseHTMLFragment } from "../../util/Hast";
import { EditorState } from "../../state/EditorState";

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

  width: 320px;
  height: 80px;

  resize: both;

  .CodeMirror {
    width: 100%;
    height: 100%;
    font-family: ${monospaceFontFamily};
    font-size: 12px;
  }
`;

function toFormattedHTML(hastNodes: hast.Content[]): string {
  return formatHTML(toHtml(hastNodes));
}

class InnerHTMLEditorState {
  constructor(editorState: EditorState, target: ElementInstance) {
    makeObservable(this);

    this.editorState = editorState;
    this.target = target;
    const innerHTML = target.element.innerHTML;
    this.lastInnerHTML = innerHTML;
    this.value = toFormattedHTML(innerHTML);

    this.disposers.push(
      reaction(
        () => target.element.innerHTML,
        action((innerHTML) => {
          if (isEqual(innerHTML, this.lastInnerHTML)) {
            return;
          }
          this.value = toFormattedHTML(innerHTML);
        })
      )
    );
  }

  private disposers: (() => void)[] = [];

  readonly editorState: EditorState;
  readonly target: ElementInstance;

  @observable value = "";
  private lastInnerHTML: hast.Content[] = [];

  @computed get bbox(): Rect {
    return this.target.boundingBox.transform(
      this.editorState.scroll.documentToViewport
    );
  }

  setValue(value: string): void {
    this.value = value;

    const node = parseHTMLFragment(value);
    this.target.setInnerHTML(node.children);
    this.lastInnerHTML = this.target.element.innerHTML;

    this.editorState.history.commitDebounced("Change Inner HTML");
  }

  readonly onChangeValue = action((value: string) => {
    this.setValue(value);
  });

  readonly onEnd = action(() => {
    this.editorState.innerHTMLEditTarget = undefined;
  });

  dispose(): void {
    this.disposers.forEach((dispose) => dispose());
  }
}

export const InnerHTMLEditorBody: React.FC<{
  target: ElementInstance;
}> = observer(({ target }) => {
  const editorState = useEditorState();
  const textareaRef = React.createRef<HTMLTextAreaElement>();
  const editorRef = React.useRef<CodeMirror.EditorFromTextArea>();

  const state = useViewModel(
    () => new InnerHTMLEditorState(editorState, target),
    [editorState, target]
  );

  useEffect(() => {
    if (!textareaRef.current) {
      return;
    }

    console.log("InnerHTMLEditorBody");

    const editor = CodeMirror.fromTextArea(textareaRef.current, {
      theme: "material-darker",
      mode: "xml",
    });
    editorRef.current = editor;
    editor.setValue(state.value);

    setTimeout(() => {
      editor.execCommand("selectAll");
      editor.focus();
    }, 0);

    editor.on("change", (editor) => {
      state.onChangeValue(editor.getValue());
    });

    return () => {
      editor.toTextArea();
    };
  }, []);

  return (
    <InnerHTMLEditorWrap>
      <Background onClick={state.onEnd} />
      <TextareaWrap
        style={{
          left: `${state.bbox.left}px`,
          top: `${state.bbox.bottom}px`,
        }}
        onWheel={(e) => e.stopPropagation()}
      >
        <textarea ref={textareaRef} />
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
