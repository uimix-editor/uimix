import { action, reaction } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef } from "react";
import { Selectable } from "@uimix/model/src/models";
import { viewportState } from "../../state/ViewportState";
import { projectState } from "../../state/ProjectState";

export const TextEditorBody: React.FC<{
  selectable: Selectable;
}> = observer(({ selectable }) => {
  const style = selectable.style;

  const cssStyle = selectable.buildCSS().self;
  delete cssStyle.marginTop;
  delete cssStyle.marginRight;
  delete cssStyle.marginBottom;
  delete cssStyle.marginLeft;

  const computedRect = selectable.computedRect;
  const fitWidth = style.width === "hug";

  const editableRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const editable = editableRef.current;
    if (!editable) {
      return;
    }

    editable.contentEditable = "plaintext-only";

    const disposeReaction = reaction(
      () => style.textContent,
      (textContent) => {
        if (textContent !== editable.innerText) {
          editable.innerText = textContent;
        }
      },
      { fireImmediately: true }
    );

    const onInput = action(() => {
      const textContent = editable.innerText;
      if (textContent !== style.textContent) {
        const target = selectable.originalVariantCorresponding;
        target.style.textContent = textContent;
      }
    });

    editable.addEventListener("input", onInput);

    return () => {
      disposeReaction();
      editable.removeEventListener("input", onInput);
    };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        transformOrigin: "left top",
        transform: projectState.scroll.documentToViewport.toCSSMatrixString(),
      }}
    >
      <div
        ref={editableRef}
        style={{
          ...cssStyle,
          position: "absolute",
          left: `${computedRect.left}px`,
          top: `${computedRect.top}px`,
          width: fitWidth ? "max-content" : `${computedRect.width}px`,
          height: `${computedRect.height}px`,
          outline: "none",
        }}
      />
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
