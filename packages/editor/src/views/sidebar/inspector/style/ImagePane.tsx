import { observer } from "mobx-react-lite";
import React from "react";
import {
  Pane,
  PaneHeading,
  PaneHeadingRow,
  Row12,
  RowGroup,
} from "@seanchas116/paintkit/src/components/sidebar/Inspector";
import { isReplacedElement } from "@seanchas116/paintkit/src/util/HTMLTagCategory";
import { Label } from "@seanchas116/paintkit/src/components/Label";
import Tippy from "@tippyjs/react";
import { StyleInspectorState } from "../../../../state/StyleInspectorState";
import { StyleSelect } from "./Components";

const objectFitOptions = ["contain", "cover", "fill", "none", "scale-down"].map(
  (value) => ({ value })
);

export const ImagePane: React.FC<{
  state: StyleInspectorState;
}> = observer(function ImagePane({ state }) {
  const imageSelected = state.selectedInstances.some((instance) =>
    isReplacedElement(instance.element.tagName)
  );
  if (!imageSelected) {
    return null;
  }

  // TODO: better object-fit toggle group

  return (
    <Pane>
      <PaneHeadingRow>
        <PaneHeading>Image</PaneHeading>
      </PaneHeadingRow>
      <RowGroup>
        <Row12>
          <Label>object-fit</Label>
          <StyleSelect
            property={state.props.objectFit}
            options={objectFitOptions}
          />
        </Row12>
      </RowGroup>
    </Pane>
  );
});
