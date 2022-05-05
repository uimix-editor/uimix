import React, { Fragment } from "react";
import { observer } from "mobx-react-lite";
import { Rect } from "paintvec";
import { useEditorState } from "../../EditorStateContext";

function rectToSVGPoints(rect: Rect) {
  return [...rect.vertices, rect.topLeft].map((v) => `${v.x},${v.y}`).join(" ");
}
function rectToSVGPointsReverse(rect: Rect) {
  return [...rect.vertices, rect.topLeft]
    .reverse()
    .map((v) => `${v.x},${v.y}`)
    .join(" ");
}

export const MarginPaddingIndicator: React.FC = observer(
  function MarginPaddingArea() {
    const editorState = useEditorState();
    const instances = editorState.document.selectedElementInstances;
    const transform = editorState.scroll.documentToViewport;

    return (
      <g opacity={0.1}>
        {instances.map((instance, i) => {
          // TODO: take transforms on margin/padding into account
          const borderRect = instance.boundingBox;
          const paddingRect = instance.boundingBox.inset(
            instance.computedBorderWidths
          );
          const contentRect = instance.boundingBox.inset(
            instance.computedPaddings
          );
          const marginRect = instance.boundingBox.inset(
            instance.computedMargins.neg
          );

          const marginPoints = `${rectToSVGPoints(
            marginRect.transform(transform)
          )} ${rectToSVGPointsReverse(borderRect.transform(transform))}`;
          const paddingPoints = `${rectToSVGPoints(
            paddingRect.transform(transform)
          )} ${rectToSVGPointsReverse(contentRect.transform(transform))}`;

          return (
            <Fragment key={i}>
              <polygon points={marginPoints} fill="#FF7800" />
              <polygon points={paddingPoints} fill="#00C553" />
            </Fragment>
          );
        })}
      </g>
    );
  }
);
