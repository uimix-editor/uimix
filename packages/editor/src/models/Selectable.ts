import { ObservableYMap } from "../utils/ObservableYMap";
import { Node } from "./Node";
import { CascadedStyle, defaultStyle, IStyle, PartialStyle } from "./Style";
import * as Y from "yjs";
import { getOrCreate } from "../state/Collection";
import { computed, makeObservable, observable } from "mobx";
import { Rect } from "paintvec";
import { resizeWithBoundingBox } from "../services/Resize";
import { NodeType } from "@uimix/node-data";
import { Project } from "./Project";
import { Component } from "./Component";

export interface IComputedRectProvider {
  readonly value: Rect | undefined;
  markDirty(): void;
}

export class StubComputedRectProvider implements IComputedRectProvider {
  constructor(rect: Rect) {
    this.value = rect;
  }
  readonly value: Rect;
  markDirty() {}
}

// a node or a inner node of an instance
export class Selectable {
  constructor(project: Project, idPath: string[], data: Y.Map<any>) {
    this.project = project;
    this.idPath = idPath;
    this.data = ObservableYMap.get(data);
    makeObservable(this);
  }

  readonly data: ObservableYMap<any>;

  readonly project: Project;

  // Non component root nodes:
  // [outermost instance ID, ..., innermost instance ID, original node ID]
  // Component root nodes:
  // [outermost instance ID, ..., innermost instance ID]
  readonly idPath: string[];

  get id(): string {
    return this.idPath.join(":");
  }

  @computed get children(): Selectable[] {
    const mainComponent = this.mainComponent;
    if (mainComponent) {
      return mainComponent.rootNode.children.map((child) => {
        return this.project.selectables.get([...this.idPath, child.id]);
      });
    }

    return this.originalNode.children.map((child) => {
      return this.project.selectables.get([
        ...this.idPath.slice(0, -1),
        child.id,
      ]);
    });
  }

  @computed get parent(): Selectable | undefined {
    const { nodePath } = this;
    const originalNode = nodePath[nodePath.length - 1];
    const parentNode = originalNode.parent;
    if (!parentNode) {
      return;
    }

    if (nodePath.length === 1) {
      return this.project.selectables.get([parentNode.id]);
    }

    if (parentNode.isComponentRoot) {
      // looks like a component root
      return this.project.selectables.get(this.idPath.slice(0, -1));
    } else {
      return this.project.selectables.get([
        ...this.idPath.slice(0, -1),
        parentNode.id,
      ]);
    }
  }

  // children/parent ignoring abstract nodes

  @computed get offsetParent(): Selectable | undefined {
    const parent = this.parent;
    if (parent?.node.type === "component") {
      return parent.offsetParent;
    }
    return parent;
  }

  @computed get offsetChildren(): Selectable[] {
    const children: Selectable[] = [];

    for (const child of this.children) {
      if (child.originalNode.type === "component") {
        children.push(...child.children);
      } else {
        children.push(child);
      }
    }
    return children;
  }

  // ancestors ([root, ..., parent, this])
  @computed get ancestors(): readonly Selectable[] {
    const result: Selectable[] = [];
    let current: Selectable | undefined = this;
    while (current) {
      result.unshift(current);
      current = current.parent;
    }
    return result;
  }

  @computed get nextSibling(): Selectable | undefined {
    const nextNode = this.originalNode.nextSibling;
    if (nextNode) {
      return this.project.selectables.get([
        ...this.idPath.slice(0, -1),
        nextNode.id,
      ]);
    }
  }

  @computed get previousSibling(): Selectable | undefined {
    const previousNode = this.originalNode.previousSibling;
    if (previousNode) {
      return this.project.selectables.get([
        ...this.idPath.slice(0, -1),
        previousNode.id,
      ]);
    }
  }

  @computed get selfStyle(): PartialStyle {
    return new PartialStyle(getOrCreate(this.data, "style", () => new Y.Map()));
  }

  @computed get nodePath(): Node[] {
    return this.idPath.map((id) => this.project.nodes.getOrThrow(id));
  }

  @computed get originalNode(): Node {
    const { nodePath } = this;
    return nodePath[nodePath.length - 1];
  }

  @computed get node(): Node {
    const mainComponent = this.mainComponent;
    if (mainComponent) {
      return mainComponent.rootNode;
    }
    return this.originalNode;
  }

  @computed get style(): IStyle {
    return this.getStyle("displayed");
  }
  @computed get originalStyle(): IStyle {
    return this.getStyle("original");
  }

  // resolveMainComponent=false to get main component ID of an instance
  private getStyle(type: "original" | "displayed"): IStyle {
    const { nodePath } = this;

    let superStyle: IStyle;

    if (nodePath.length === 1) {
      superStyle = defaultStyle;

      if (type === "displayed") {
        const mainComponent = this.mainComponent;
        if (mainComponent) {
          superStyle = this.project.selectables
            .get([mainComponent.rootNode.id])
            .getStyle("original");
        }
      }
    } else {
      const superSelectable = this.project.selectables.get(
        this.idPath.slice(1)
      );
      superStyle = superSelectable.getStyle(type);
    }

    return new CascadedStyle(this.selfStyle, superStyle);
  }

  @computed get mainComponent(): Component | undefined {
    const originalNode = this.originalNode;
    if (originalNode.type === "instance") {
      const { mainComponentID } = this.originalStyle;
      if (mainComponentID) {
        const ownerComponents = this.nodePath.map(
          (node) => node.ownerComponent?.node
        );

        const mainComponentNode = this.project.nodes.get(mainComponentID);
        if (mainComponentNode && !ownerComponents.includes(mainComponentNode)) {
          return Component.from(mainComponentNode);
        }
      }
    }
    if (originalNode.type === "variant") {
      const componentNode = originalNode.parent;
      if (componentNode?.type === "component") {
        return Component.from(componentNode);
      }
    }
  }

  @computed private get _selected(): boolean {
    return this.data.get("selected") ?? false;
  }

  private set _selected(value: boolean) {
    this.data.set("selected", value);
  }

  @computed get selected(): boolean {
    return this._selected;
  }

  select() {
    this._selected = true;
    for (const child of this.children) {
      child.deselect();
    }
  }

  deselect() {
    this._selected = false;
    for (const child of this.children) {
      child.deselect();
    }
  }

  @computed.struct get selectedDescendants(): Selectable[] {
    if (this.selected) {
      return [this];
    }
    return this.children.flatMap((child) => child.selectedDescendants);
  }

  @computed get ancestorSelected(): boolean {
    return this.selected || !!this.parent?.ancestorSelected;
  }

  @observable computedRectProvider: IComputedRectProvider | undefined =
    undefined;

  @computed.struct get computedRect(): Rect {
    return this.computedRectProvider?.value ?? new Rect();
  }

  @computed get computedOffsetRect(): Rect {
    const { offsetParent } = this;
    if (!offsetParent) {
      return this.computedRect;
    }
    return this.computedRect.translate(offsetParent.computedRect.topLeft.neg);
  }

  @computed get computedOffsetLeft(): number {
    const { offsetParent } = this;
    if (offsetParent) {
      return this.computedRect.left - offsetParent.computedRect.left;
    }
    return this.computedRect.left;
  }

  @computed get computedOffsetTop(): number {
    const { offsetParent } = this;
    if (offsetParent) {
      return this.computedRect.top - offsetParent.computedRect.top;
    }
    return this.computedRect.top;
  }

  @computed get computedOffsetRight(): number | undefined {
    const { offsetParent } = this;
    if (offsetParent) {
      return offsetParent.computedRect.right - this.computedRect.right;
    }
  }

  @computed get computedOffsetBottom(): number | undefined {
    const { offsetParent } = this;
    if (offsetParent) {
      return offsetParent.computedRect.bottom - this.computedRect.bottom;
    }
  }

  @observable collapsed = false;

  expandAncestors() {
    const { parent } = this;
    if (parent) {
      parent.expandAncestors();
      parent.collapsed = false;
    }
  }

  @computed get inFlowChildren(): Selectable[] {
    return this.children.filter((child) => child.inFlow);
  }

  @computed get inFlow(): boolean {
    if (this.parent?.style.layout !== "none") {
      return !this.style.absolute;
    }
    return false;
  }

  createBefore(type: NodeType, next: Selectable | undefined): Selectable {
    const node = this.project.nodes.create(type);
    this.originalNode.insertBefore([node], next?.originalNode);
    return this.project.selectables.get([node.id]);
  }

  append(type: NodeType): Selectable {
    return this.createBefore(type, undefined);
  }

  // insert(index: number, contents: Omit<NodeJSON, "id">[]): Selectable[] {
  //   this.node.insert(index, contents);
  //   return this.children.slice(index, index + contents.length);
  // }

  // prepend(contents: Omit<NodeJSON, "id">[]): Selectable[] {
  //   return this.insert(0, contents);
  // }

  // append(contents: Omit<NodeJSON, "id">[]): Selectable[] {
  //   return this.insert(this.children.length, contents);
  // }

  includes(other: Selectable): boolean {
    return other.ancestors.includes(this);
  }

  get canInsertChild(): boolean {
    const { originalNode } = this;
    return originalNode.type === "page" || originalNode.type === "frame";
  }

  @computed.struct get usedFontFamilies(): Set<string> {
    const { style } = this;
    const result = new Set<string>();
    if (style.fontFamily) {
      result.add(style.fontFamily);
    }

    for (const child of this.children) {
      for (const font of child.usedFontFamilies) {
        result.add(font);
      }
    }
    return result;
  }

  @computed get refID(): string | undefined {
    const ownerComponent = this.originalNode.ownerComponent;
    if (!ownerComponent || ownerComponent.rootNode === this.originalNode) {
      return undefined;
    }

    return ownerComponent.refIDs.get(this.originalNode.id);
  }

  /// mutations

  remove() {
    if (this.idPath.length >= 2) {
      // TODO: hide?
      throw new Error(
        "TODO: removing items inside an instance is not supported yet"
      );
    }

    const { originalNode } = this;
    const { parent } = originalNode;
    if (originalNode.type !== "variant" && parent?.type === "component") {
      // removing component root node -> remove component
      parent.remove();
      return;
    }

    originalNode.remove();
  }

  insertBefore(
    dstNextSibling: Selectable | undefined,
    selectables: readonly Selectable[],
    {
      fixPosition = true,
    }: {
      fixPosition?: boolean;
    } = {}
  ) {
    selectables = selectables.filter((s) => !s.includes(this));
    if (selectables.length === 0) {
      return;
    }

    if (
      this.idPath.length > 1 ||
      selectables.some((selectable) => selectable.idPath.length > 1)
    ) {
      console.log(
        'TODO: moving items inside an instance is not supported yet"'
      );
      return;
    }

    this.node.insertBefore(
      selectables.map((s) => s.originalNode),
      dstNextSibling?.originalNode
    );

    if (fixPosition) {
      for (const selectable of selectables) {
        const absolute =
          this.style.layout === "none" || selectable.style.absolute;

        if (absolute) {
          const bbox = selectable.computedRect;
          resizeWithBoundingBox(
            selectable,
            bbox,
            { x: true, y: true },
            this.computedRect.topLeft
          );
        }
      }
    }
  }
}

export class SelectableMap {
  constructor(project: Project, data: Y.Map<Y.Map<any>>) {
    this.project = project;
    this.selectablesData = data;
  }

  private readonly project: Project;
  private readonly selectablesData: Y.Map<Y.Map<any>>;
  private readonly selectablesCache = new WeakMap<Y.Map<any>, Selectable>();

  private getSelectableData(idPath: string[]): Y.Map<any> {
    const key = idPath.join(":");
    let data = this.selectablesData.get(key);
    if (data === undefined) {
      data = new Y.Map();
      this.selectablesData.set(key, data);
    }
    return data;
  }

  get(idPath: string[]): Selectable {
    const data = this.getSelectableData(idPath);
    return getOrCreate(this.selectablesCache, data, () => {
      return new Selectable(this.project, idPath, data);
    });
  }
}
