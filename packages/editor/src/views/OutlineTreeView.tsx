import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import {
  LeafTreeViewItem,
  RootTreeViewItem,
  TreeViewItem,
} from "@seanchas116/paintkit/dist/components/treeview/TreeViewItem";
import { makeObservable } from "mobx";
import { EditorState } from "../state/EditorState";
import { Component } from "../models/Component";
import { Variant } from "../models/Variant";
import { Element } from "../models/Element";
import { Text } from "../models/Text";

export const OutlineTreeView: React.FC<{
  editorState: EditorState;
}> = observer(({ editorState }) => {
  return <OutlineTreeViewWrap></OutlineTreeViewWrap>;
});

class RootItem extends RootTreeViewItem {
  constructor(editorState: EditorState) {
    super();
    this.editorState = editorState;
  }

  readonly editorState: EditorState;

  get children(): readonly TreeViewItem[] {
    return this.editorState.document.components.map(
      (c) => new ComponentItem(this, this.editorState, c)
    );
  }

  deselect(): void {
    throw new Error("Method not implemented.");
  }
}

class ComponentItem extends TreeViewItem {
  constructor(
    parent: RootItem,
    editorState: EditorState,
    component: Component
  ) {
    super();
    this.parent = parent;
    this.editorState = editorState;
    this.component = component;
    makeObservable(this);
  }

  readonly parent: RootItem;
  readonly editorState: EditorState;
  readonly component: Component;

  get key(): string {
    return this.key;
  }

  get children(): readonly TreeViewItem[] {
    return [this.component.defaultVariant, ...this.component.variants].map(
      (variant) => new VariantItem(this, this.editorState, variant)
    );
  }

  get selected(): boolean {
    throw new Error("Method not implemented.");
  }
  get hovered(): boolean {
    throw new Error("Method not implemented.");
  }
  get collapsed(): boolean {
    throw new Error("Method not implemented.");
  }
  get showsCollapseButton(): boolean {
    return true;
  }

  deselect(): void {
    throw new Error("Method not implemented.");
  }
  select(): void {
    throw new Error("Method not implemented.");
  }
  toggleCollapsed(): void {
    throw new Error("Method not implemented.");
  }

  renderRow(options: { inverted: boolean }): React.ReactNode {
    throw new Error("Method not implemented.");
  }
}

class VariantItem extends TreeViewItem {
  constructor(
    parent: ComponentItem,
    editorState: EditorState,
    variant: Variant
  ) {
    super();
    this.parent = parent;
    this.editorState = editorState;
    this.variant = variant;
    makeObservable(this);
  }

  readonly parent: ComponentItem;
  readonly editorState: EditorState;
  readonly variant: Variant;

  get key(): string {
    return this.variant.key;
  }

  get children(): readonly TreeViewItem[] {
    return this.variant.component.rootElement.children.map((node) => {
      if (node.type === "element") {
        return new ElementItem(this, this.editorState, this.variant, node);
      } else {
        return new TextItem(this, this.editorState, this.variant, node);
      }
    });
  }

  get selected(): boolean {
    throw new Error("Method not implemented.");
  }
  get hovered(): boolean {
    throw new Error("Method not implemented.");
  }
  get collapsed(): boolean {
    throw new Error("Method not implemented.");
  }
  get showsCollapseButton(): boolean {
    return true;
  }

  deselect(): void {
    throw new Error("Method not implemented.");
  }
  select(): void {
    throw new Error("Method not implemented.");
  }
  toggleCollapsed(): void {
    throw new Error("Method not implemented.");
  }

  renderRow(options: { inverted: boolean }): React.ReactNode {
    throw new Error("Method not implemented.");
  }
}

class ElementItem extends TreeViewItem {
  constructor(
    parent: ElementItem | VariantItem,
    editorState: EditorState,
    variant: Variant,
    element: Element
  ) {
    super();
    this.parent = parent;
    this.editorState = editorState;
    this.variant = variant;
    this.element = element;
  }

  readonly parent: ElementItem | VariantItem;
  readonly editorState: EditorState;
  readonly variant: Variant;
  readonly element: Element;

  get children(): readonly TreeViewItem[] {
    return this.element.children.map((node) => {
      if (node.type === "element") {
        return new ElementItem(this, this.editorState, this.variant, node);
      } else {
        return new TextItem(this, this.editorState, this.variant, node);
      }
    });
  }

  get key(): string {
    return this.element.key;
  }

  get selected(): boolean {
    throw new Error("Method not implemented.");
  }
  get hovered(): boolean {
    throw new Error("Method not implemented.");
  }
  get collapsed(): boolean {
    throw new Error("Method not implemented.");
  }
  get showsCollapseButton(): boolean {
    return true;
  }

  deselect(): void {
    throw new Error("Method not implemented.");
  }
  select(): void {
    throw new Error("Method not implemented.");
  }
  toggleCollapsed(): void {
    throw new Error("Method not implemented.");
  }

  renderRow(options: { inverted: boolean }): React.ReactNode {
    throw new Error("Method not implemented.");
  }
}

class TextItem extends LeafTreeViewItem {
  constructor(
    parent: ElementItem | VariantItem,
    editorState: EditorState,
    variant: Variant,
    text: Text
  ) {
    super();
    this.parent = parent;
    this.editorState = editorState;
    this.variant = variant;
    this.text = text;
  }

  readonly parent: ElementItem | VariantItem;
  readonly editorState: EditorState;
  readonly variant: Variant;
  readonly text: Text;

  get key(): string {
    return this.text.key;
  }

  get selected(): boolean {
    throw new Error("Method not implemented.");
  }
  get hovered(): boolean {
    throw new Error("Method not implemented.");
  }

  deselect(): void {
    throw new Error("Method not implemented.");
  }
  select(): void {
    throw new Error("Method not implemented.");
  }

  renderRow(options: { inverted: boolean }): React.ReactNode {
    throw new Error("Method not implemented.");
  }
}

const OutlineTreeViewWrap = styled.div``;
