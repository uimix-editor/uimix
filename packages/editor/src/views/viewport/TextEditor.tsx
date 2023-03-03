import { action } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useCallback, useMemo } from "react";
import { buildNodeCSS } from "@uimix/render";
import { createEditor, Transforms, Descendant } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { Selectable } from "../../models/Selectable";
import { scrollState } from "../../state/ScrollState";
import { viewportState } from "../../state/ViewportState";

export const TextEditorBody: React.FC<{
  selectable: Selectable;
}> = observer(({ selectable }) => {
  const style = selectable.style;

  const cssStyle = buildNodeCSS("text", style);
  const computedRect = selectable.computedRect;

  const fitWidth = style.width.type === "hugContents";

  const editor = useMemo(() => withReact(createEditor()), []);

  const onKeyDownEditable = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        Transforms.insertText(editor, "\n");
        event.preventDefault();
      }
    },
    [editor]
  );

  const initialValue: Descendant[] = [
    {
      // @ts-ignore
      type: "paragraph",
      children: [
        {
          text: style.textContent,
        },
      ],
    },
  ];

  return (
    <div
      style={{
        position: "absolute",
        transformOrigin: "left top",
        transform: scrollState.documentToViewport.toCSSMatrixString(),
      }}
    >
      <div
        style={{
          ...cssStyle,
          position: "absolute",
          left: computedRect.left + "px",
          top: computedRect.top + "px",
          width: fitWidth ? "max-content" : computedRect.width + "px",
          height: computedRect.height + "px",
        }}
      >
        <Slate
          editor={editor}
          onChange={action((value) => {
            // @ts-ignore
            style.textContent = value[0].children[0].text;
          })}
          value={initialValue}
        >
          <Editable onKeyDown={onKeyDownEditable} />
        </Slate>
      </div>
    </div>
  );
});

export const TextEditor: React.FC = observer(() => {
  const focused = viewportState.focusedSelectable;
  if (!focused) {
    return null;
  }
  return <TextEditorBody selectable={focused} key={focused.id} />;
});
