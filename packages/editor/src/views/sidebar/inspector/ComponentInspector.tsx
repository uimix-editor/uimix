import { observer } from "mobx-react-lite";
import React, { useMemo } from "react";
import styled from "styled-components";
import { action, computed } from "mobx";
import {
  Pane,
  PaneHeading,
  PaneHeadingRow,
} from "@seanchas116/paintkit/src/components/sidebar/Inspector";
import { colors } from "@seanchas116/paintkit/src/components/Palette";
import switchIcon from "@seanchas116/paintkit/src/icon/Switch";
import arrowIcon from "@iconify-icons/ic/outline-arrow-forward";
import { TreeRowIcon } from "@seanchas116/paintkit/src/components/treeview/TreeRow";
import {
  IconButton,
  PlusButton,
} from "@seanchas116/paintkit/src/components/IconButton";
import Tippy from "@tippyjs/react";
import { EditorState } from "../../../state/EditorState";
import { useEditorState } from "../../EditorStateContext";
import { DefaultVariant, Variant } from "../../../models/Variant";
import { Component } from "../../../models/Component";

class ComponentInspectorState {
  constructor(editorState: EditorState) {
    this.editorState = editorState;
  }
  readonly editorState: EditorState;

  @computed get component(): Component | undefined {
    return (
      this.editorState.document.selectedComponents[0] ??
      this.editorState.document.selectedVariants[0]?.component
    );
  }

  @computed get variants(): (Variant | DefaultVariant)[] {
    return this.component?.allVariants ?? [];
  }

  onGoToVariant(variant: Variant | DefaultVariant) {
    this.editorState.document.deselect();
    variant.rootInstance?.select();
  }

  addVariant(): void {
    const { component } = this;
    if (!component) {
      return;
    }
    const variant = new Variant();
    variant.selector = ":hover";
    component.variants.append(variant);

    this.editorState.document.deselect();
    variant.rootInstance?.select();
  }

  readonly onAddVariant = action(this.addVariant.bind(this));
}

const ComponentInspectorWrap = styled.div``;

export const ComponentInspector: React.FC = observer(
  function ComponentInspector() {
    const editorState = useEditorState();

    const state = useMemo(
      () => new ComponentInspectorState(editorState),
      [editorState]
    );

    const { variants } = state;

    return (
      <ComponentInspectorWrap>
        <Pane>
          <PaneHeadingRow>
            <PaneHeading>Variants</PaneHeading>
            <PlusButton onClick={state.onAddVariant} />
          </PaneHeadingRow>
          {variants.length > 0 && (
            <VariantRows>
              {variants.map((variant) => {
                return (
                  <VariantRow
                    key={variant.key}
                    aria-selected={variant.rootInstance?.selected}
                  >
                    <TreeRowIcon icon={switchIcon} />
                    <VariantName>{variant.name}</VariantName>
                    <Tippy content="Go to Variant">
                      <IconButton
                        icon={arrowIcon}
                        onClick={action(() => state.onGoToVariant(variant))}
                      />
                    </Tippy>
                  </VariantRow>
                );
              })}
            </VariantRows>
          )}
        </Pane>
      </ComponentInspectorWrap>
    );
  }
);

const VariantRow = styled.div`
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &[aria-selected="true"] {
    background: ${colors.active};
  }
`;

const VariantName = styled.div`
  flex: 1;
  font-size: 12px;
  color: ${colors.text};
  line-height: 24px;
`;

const VariantRows = styled.div`
  display: flex;
  flex-direction: column;
`;
