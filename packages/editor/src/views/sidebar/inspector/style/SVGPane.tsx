import { observer } from "mobx-react-lite";
import React from "react";
import {
  Pane,
  PaneHeading,
  PaneHeadingRow,
  RowGroup,
} from "@seanchas116/paintkit/src/components/sidebar/Inspector";
import { StyleInspectorState } from "../../../../state/StyleInspectorState";
import { StyleColorInput } from "./Components";

export const SVGPane: React.FC<{
  state: StyleInspectorState;
}> = observer(function SVGPane({ state }) {
  if (state.svgInstances.length === 0 || state.textInstances.length) {
    return null;
  }

  // TODO: better object-fit toggle group

  return (
    <Pane>
      <PaneHeadingRow>
        <PaneHeading>SVG</PaneHeading>
      </PaneHeadingRow>
      <RowGroup>
        <StyleColorInput property={state.props.color} />
      </RowGroup>
    </Pane>
  );
});
