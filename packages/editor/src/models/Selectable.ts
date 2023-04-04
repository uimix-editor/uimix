import { ObservableYMap } from "@uimix/foundation/src/utils/ObservableYMap";
import { abstractNodeTypes, Node } from "./Node";
import { CascadedStyle, defaultStyle, IStyle, PartialStyle } from "./Style";
import * as Y from "yjs";
import { getOrCreate } from "@uimix/foundation/src/utils/Collection";
import { computed, makeObservable, observable } from "mobx";
import { Rect } from "paintvec";
import { resizeWithBoundingBox } from "../services/Resize";
import {
  SelectableJSON,
  NodeJSON,
  NodeType,
  ProjectJSON,
} from "@uimix/node-data";
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

class SelectablePartialStyle extends PartialStyle {
  constructor(selectable: Selectable) {
    super();
    this.selectable = selectable;
  }

  selectable: Selectable;

  get data(): ObservableYMap<unknown> | undefined {
    return ObservableYMap.get(
      this.selectable.selectableMap.stylesData.get(this.selectable.id)
    );
  }

  get dataForWrite(): ObservableYMap<unknown> {
    return ObservableYMap.get(
      getOrCreate(
        this.selectable.selectableMap.stylesData,
        this.selectable.id,
        () => new Y.Map()
      )
    );
  }
}

// a node or a inner node of an instance
export class Selectable {
  constructor(project: Project, idPath: string[]) {
    if (idPath.length === 0) {
      throw new Error("idPath must not be empty");
    }
    this.project = project;
    this.selectableMap = project.selectables;
    this.idPath = idPath;
    makeObservable(this);
  }

  readonly project: Project;
  readonly selectableMap: SelectableMap;

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
    if (parent && abstractNodeTypes.includes(parent.node.type)) {
      return parent.offsetParent;
    }
    return parent;
  }

  @computed get offsetChildren(): Selectable[] {
    const children: Selectable[] = [];

    for (const child of this.children) {
      if (abstractNodeTypes.includes(child.originalNode.type)) {
        children.push(...child.children);
      } else {
        children.push(child);
      }
    }
    return children;
  }

  @computed get pageSelectable(): Selectable | undefined {
    if (this.originalNode.type === "page") {
      return this;
    }
    return this.parent?.pageSelectable;
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
    return new SelectablePartialStyle(this);
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

  @computed get style(): CascadedStyle {
    return this.getStyle("displayed");
  }
  @computed get originalStyle(): CascadedStyle {
    return this.getStyle("original");
  }

  get superSelectable(): Selectable | undefined {
    if (this.idPath.length === 1) {
      const mainComponent = this.mainComponent;
      if (mainComponent) {
        return mainComponent.rootNode.selectable;
      }
      return;
    }
    return this.project.selectables.get(this.idPath.slice(1));
  }

  // resolveMainComponent=false to get main component ID of an instance
  private getStyle(type: "original" | "displayed"): CascadedStyle {
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
      const mainComponentID = this.originalStyle.mainComponent;
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
    return this.selectableMap.selectionData.has(this.id);
  }

  private set _selected(value: boolean) {
    if (this._selected === value) {
      return;
    }
    if (value) {
      this.selectableMap.selectionData.set(this.id, true);
    } else {
      this.selectableMap.selectionData.delete(this.id);
    }
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

  @computed get ancestorLocked(): boolean {
    return this.style.locked || !!this.parent?.ancestorLocked;
  }

  @observable computedRectProvider: IComputedRectProvider | undefined =
    undefined;

  @computed.struct get computedRect(): Rect {
    return this.computedRectProvider?.value ?? new Rect();
  }

  @computed get computedPaddingRect(): Rect {
    const { computedRect, style } = this;
    const {
      borderLeftWidth,
      borderRightWidth,
      borderTopWidth,
      borderBottomWidth,
    } = style;

    return Rect.from({
      left: computedRect.left + borderLeftWidth,
      top: computedRect.top + borderTopWidth,
      width: computedRect.width - borderLeftWidth - borderRightWidth,
      height: computedRect.height - borderTopWidth - borderBottomWidth,
    });
  }

  @computed get computedContentRect(): Rect {
    const { computedRect, style } = this;
    const {
      borderLeftWidth,
      borderRightWidth,
      borderTopWidth,
      borderBottomWidth,
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
    } = style;

    return Rect.from({
      left: computedRect.left + borderLeftWidth + paddingLeft,
      top: computedRect.top + borderTopWidth + paddingTop,
      width:
        computedRect.width -
        borderLeftWidth -
        borderRightWidth -
        paddingLeft -
        paddingRight,
      height:
        computedRect.height -
        borderTopWidth -
        borderBottomWidth -
        paddingTop -
        paddingBottom,
    });
  }

  @computed get computedMarginRect(): Rect {
    if (this.isAbsolute) {
      return this.computedRect;
    }

    const { computedRect, style } = this;
    const { marginLeft, marginRight, marginTop, marginBottom } = style;

    return Rect.from({
      left: computedRect.left - marginLeft,
      top: computedRect.top - marginTop,
      width: computedRect.width + marginLeft + marginRight,
      height: computedRect.height + marginTop + marginBottom,
    });
  }

  @computed get computedOffsetRect(): Rect {
    const { offsetParent } = this;
    if (!offsetParent) {
      return this.computedRect;
    }
    return this.computedRect.translate(
      offsetParent.computedPaddingRect.topLeft.neg
    );
  }

  @computed get computedOffsetLeft(): number {
    const { offsetParent } = this;
    if (offsetParent) {
      return this.computedRect.left - offsetParent.computedPaddingRect.left;
    }
    return this.computedRect.left;
  }

  @computed get computedOffsetTop(): number {
    const { offsetParent } = this;
    if (offsetParent) {
      return this.computedRect.top - offsetParent.computedPaddingRect.top;
    }
    return this.computedRect.top;
  }

  @computed get computedOffsetRight(): number | undefined {
    const { offsetParent } = this;
    if (offsetParent) {
      return offsetParent.computedPaddingRect.right - this.computedRect.right;
    }
  }

  @computed get computedOffsetBottom(): number | undefined {
    const { offsetParent } = this;
    if (offsetParent) {
      return offsetParent.computedPaddingRect.bottom - this.computedRect.bottom;
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
    return this.children.filter((child) => !child.isAbsolute);
  }

  @computed get isAbsolute(): boolean {
    if (this.parent?.style.layout !== "none") {
      return this.style.absolute;
    }
    return true;
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
    selectables: readonly Selectable[],
    dstNextSibling: Selectable | undefined,
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
          resizeWithBoundingBox(selectable, bbox, { x: true, y: true });
        }
      }
    }
  }

  toJSON(): SelectableJSON {
    const originalNode = this.originalNode;
    const node = this.node;

    return {
      id: this.id,
      name: originalNode.name,
      type: node.type,
      original: {
        id: originalNode.id,
        type: originalNode.type,
        condition: originalNode.condition,
      },
      style: this.style.toJSON(),
      selfStyle: this.selfStyle.toJSON(),
      children: this.children.map((child) => child.toJSON()),
    };
  }

  static fromJSON(project: Project, json: SelectableJSON): Selectable {
    const node = project.nodes.create(json.type);
    node.name = json.name;
    const selectable = node.selectable;
    selectable.selfStyle.loadJSON(json.style);

    const children = json.children.map((child) =>
      Selectable.fromJSON(project, child)
    );
    node.insertBefore(
      children.map((c) => c.originalNode),
      undefined
    );
    return selectable;
  }
}

export class SelectableMap {
  constructor(project: Project) {
    this.project = project;
  }

  get stylesData(): ObservableYMap<Y.Map<unknown>> {
    return ObservableYMap.get(this.project.doc.getMap("styles"));
  }
  get selectionData(): ObservableYMap<true> {
    return ObservableYMap.get(this.project.doc.getMap("selection"));
  }

  private readonly project: Project;
  private readonly selectableMap = new Map<string, Selectable>();

  get(idPath: string[]): Selectable {
    return getOrCreate(this.selectableMap, idPath.join(":"), () => {
      return new Selectable(this.project, idPath);
    });
  }
}

// TODO generate correctly from instance contents
export function selectablesToProjectJSON(
  selectables: Selectable[]
): ProjectJSON {
  const nodeJSONs: Record<string, NodeJSON> = {};
  const styles: Record<string, Partial<IStyle>> = {};

  const addRecursively = (selectable: Selectable) => {
    if (selectable.idPath.length === 1) {
      const node = selectable.originalNode;
      nodeJSONs[node.id] = node.toJSON();
      if (selectables.includes(selectable)) {
        nodeJSONs[node.id].parent = undefined;
      }
    }

    styles[selectable.id] = selectable.selfStyle.toJSON();
    for (const child of selectable.children) {
      addRecursively(child);
    }
  };

  for (const selected of selectables) {
    addRecursively(selected);
  }

  return {
    nodes: nodeJSONs,
    styles,
  };
}
