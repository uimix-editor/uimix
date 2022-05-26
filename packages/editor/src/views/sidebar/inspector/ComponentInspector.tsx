import { observer } from "mobx-react-lite";
import React, { useMemo } from "react";
import styled from "styled-components";
import { action, computed, makeObservable } from "mobx";
import {
  Pane,
  PaneHeading,
  PaneHeadingRow,
} from "@seanchas116/paintkit/src/components/sidebar/Inspector";
import switchIcon from "@seanchas116/paintkit/src/icon/Switch";
import {
  MinusButton,
  PlusButton,
} from "@seanchas116/paintkit/src/components/IconButton";
import {
  LeafTreeViewItem,
  RootTreeViewItem,
  TreeViewItem,
} from "@seanchas116/paintkit/src/components/treeview/TreeViewItem";
import { TreeView } from "@seanchas116/paintkit/src/components/treeview/TreeView";
import {
  TreeRow,
  TreeRowIcon,
  TreeRowLabel,
} from "@seanchas116/paintkit/src/components/treeview/TreeRow";
import { EditorState } from "../../../state/EditorState";
import { useEditorState } from "../../EditorStateContext";
import { DefaultVariant, Variant } from "../../../models/Variant";
import { Component } from "../../../models/Component";
import { addVariant } from "../../../services/AddVariant";

class ComponentInspectorState {
  constructor(editorState: EditorState) {
    this.editorState = editorState;
    makeObservable(this);
  }

  readonly editorState: EditorState;

  @computed get component(): Component | undefined {
    return (
      this.editorState.document.selectedComponents[0] ??
      this.editorState.document.selectedVariants[0]?.component
    );
  }

  @computed get listViewRoot(): ComponentItem | undefined {
    const component = this.component;
    if (component) {
      return new ComponentItem(component, this.editorState);
    }
  }
}

export const ComponentInspector: React.FC = observer(
  function ComponentInspector() {
    const editorState = useEditorState();

    const state = useMemo(
      () => new ComponentInspectorState(editorState),
      [editorState]
    );

    const { listViewRoot } = state;

    return (
      <Pane>
        <PaneHeadingRow>
          <PaneHeading>Variants</PaneHeading>
          <PlusButton onClick={action(() => listViewRoot?.addVariant())} />
          <MinusButton
            disabled={!listViewRoot?.canDeleteVariants}
            onClick={action(() => listViewRoot?.deleteVariants())}
          />
        </PaneHeadingRow>
        {listViewRoot && (
          <StyledTreeView scroll={false} rootItem={listViewRoot} />
        )}
      </Pane>
    );
  }
);

const DRAG_MIME = "application/x.macaron-component-variant-list-drag";

class ComponentItem extends RootTreeViewItem {
  constructor(component: Component, editorState: EditorState) {
    super();
    this.component = component;
    this.editorState = editorState;
    makeObservable(this);
  }

  component: Component;
  editorState: EditorState;

  @computed get children(): TreeViewItem[] {
    return this.component.allVariants.map((v) => new VariantItem(v, this));
  }

  deselect(): void {
    this.component.select();
  }

  canDropData(dataTransfer: DataTransfer) {
    return dataTransfer.types.includes(DRAG_MIME);
  }

  handleDrop(event: React.DragEvent, before: TreeViewItem | undefined): void {
    let beforeVariant = (before as VariantItem | undefined)?.variant;
    if (beforeVariant?.type === "defaultVariant") {
      beforeVariant = this.component.variants.firstChild;
    }

    const { selectedVariants } = this;
    if (selectedVariants.length === 0) {
      return;
    }

    for (const variant of selectedVariants) {
      if (variant.type !== "defaultVariant") {
        this.component.variants.insertBefore(variant, beforeVariant);
      }
    }
    this.editorState.history.commit("Move Variants");
  }

  @computed get selectedVariants(): readonly (Variant | DefaultVariant)[] {
    return this.component.allVariants.filter((v) => v.rootInstance?.selected);
  }

  @computed get canDeleteVariants(): boolean {
    return this.selectedVariants.some((v) => v.type === "variant");
  }

  addVariant(): void {
    const { component } = this;
    if (!component) {
      return;
    }

    const variant = addVariant(component);
    this.editorState.document.deselect();
    variant.rootInstance?.select();
  }

  deleteVariants() {
    for (const v of this.selectedVariants) {
      if (v.type !== "defaultVariant") {
        v.remove();
      }
    }
    this.component.select();
    this.editorState.history.commit("Remove Variants");
  }
}

class VariantItem extends LeafTreeViewItem {
  constructor(variant: Variant | DefaultVariant, parent: ComponentItem) {
    super();
    this.variant = variant;
    this.parent = parent;
    makeObservable(this);
  }

  readonly parent: ComponentItem;
  readonly variant: Variant | DefaultVariant;

  get editorState(): EditorState {
    return this.parent.editorState;
  }

  get key(): string {
    return this.variant.key;
  }
  @computed get selected(): boolean {
    return !!this.variant.rootInstance?.selected;
  }
  @computed get hovered(): boolean {
    return this.editorState.hoveredItem === this.variant.rootInstance;
  }

  handleMouseEnter(): void {
    this.editorState.hoveredItem = this.variant.rootInstance;
  }
  handleMouseLeave(): void {
    this.editorState.hoveredItem = undefined;
  }

  renderRow({ inverted }: { inverted: boolean }): React.ReactNode {
    return (
      <TreeRow inverted={inverted}>
        <TreeRowIcon icon={switchIcon} />
        <TreeRowLabel>{this.variant.name}</TreeRowLabel>
      </TreeRow>
    );
  }

  select(): void {
    this.editorState.document.deselect();
    this.variant.rootInstance?.select();
  }

  deselect(): void {
    if (2 <= this.parent.selectedVariants.length) {
      this.variant.rootInstance?.deselect();
    } else {
      this.parent.component.select();
    }
  }

  handleDragStart(e: React.DragEvent) {
    e.dataTransfer.effectAllowed = "copyMove";
    e.dataTransfer.setData(DRAG_MIME, "drag");
  }

  // handleContextMenu(e: React.MouseEvent) {
  //   e.preventDefault();
  //   this.pageState.editorState.showContextMenu(
  //     e,
  //     variantContextMenu(this.pageState, this.variant)
  //   );
  // }
}

const StyledTreeView = styled(TreeView)`
  margin: 0 -12px;
` as typeof TreeView;
