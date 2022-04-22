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
import { ElementInstance } from "../models/ElementInstance";
import { TextInstance } from "../models/TextInstance";

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
    return this.component.selected;
  }
  get hovered(): boolean {
    throw new Error("Method not implemented.");
  }
  get collapsed(): boolean {
    return this.component.collapsed;
  }
  get showsCollapseButton(): boolean {
    return true;
  }

  deselect(): void {
    this.component.deselect();
  }
  select(): void {
    this.component.select();
  }
  toggleCollapsed(): void {
    this.component.collapsed = !this.component.collapsed;
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
    return this.variant.rootInstance.children.map((instance) => {
      if (instance.type === "element") {
        return new ElementItem(this, this.editorState, instance);
      } else {
        return new TextItem(this, this.editorState, instance);
      }
    });
  }

  get selected(): boolean {
    return this.variant.rootInstance.selected;
  }
  get hovered(): boolean {
    throw new Error("Method not implemented.");
  }
  get collapsed(): boolean {
    return this.variant.rootInstance.collapsed;
  }
  get showsCollapseButton(): boolean {
    return true;
  }

  deselect(): void {
    return this.variant.rootInstance.deselect();
  }
  select(): void {
    return this.variant.rootInstance.select();
  }
  toggleCollapsed(): void {
    this.variant.rootInstance.collapsed = !this.variant.rootInstance.collapsed;
  }

  renderRow(options: { inverted: boolean }): React.ReactNode {
    throw new Error("Method not implemented.");
  }
}

class ElementItem extends TreeViewItem {
  constructor(
    parent: ElementItem | VariantItem,
    editorState: EditorState,
    instance: ElementInstance
  ) {
    super();
    this.parent = parent;
    this.editorState = editorState;
    this.instance = instance;
  }

  readonly parent: ElementItem | VariantItem;
  readonly editorState: EditorState;
  readonly instance: ElementInstance;

  get children(): readonly TreeViewItem[] {
    return this.instance.children.map((instance) => {
      if (instance.type === "element") {
        return new ElementItem(this, this.editorState, instance);
      } else {
        return new TextItem(this, this.editorState, instance);
      }
    });
  }

  get key(): string {
    return this.instance.element.key;
  }

  get selected(): boolean {
    return this.instance.selected;
  }
  get hovered(): boolean {
    throw new Error("Method not implemented.");
  }
  get collapsed(): boolean {
    return this.instance.collapsed;
  }
  get showsCollapseButton(): boolean {
    return true;
  }

  deselect(): void {
    this.instance.deselect();
  }
  select(): void {
    this.instance.select();
  }
  toggleCollapsed(): void {
    this.instance.collapsed = !this.instance.collapsed;
  }

  renderRow(options: { inverted: boolean }): React.ReactNode {
    throw new Error("Method not implemented.");
  }
}

class TextItem extends LeafTreeViewItem {
  constructor(
    parent: ElementItem | VariantItem,
    editorState: EditorState,
    instance: TextInstance
  ) {
    super();
    this.parent = parent;
    this.editorState = editorState;
    this.instance = instance;
  }

  readonly parent: ElementItem | VariantItem;
  readonly editorState: EditorState;
  readonly instance: TextInstance;

  get key(): string {
    return this.instance.text.key;
  }

  get selected(): boolean {
    return this.instance.selected;
  }
  get hovered(): boolean {
    throw new Error("Method not implemented.");
  }

  deselect(): void {
    this.instance.deselect();
  }
  select(): void {
    this.instance.select();
  }

  renderRow(options: { inverted: boolean }): React.ReactNode {
    throw new Error("Method not implemented.");
  }
}

const OutlineTreeViewWrap = styled.div``;
