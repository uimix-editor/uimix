import { ObservableYMap } from "@uimix/foundation/src/utils/ObservableYMap";
import { abstractNodeTypes, Node } from "./Node";
import { CascadedStyle, defaultStyle, IStyle, PartialStyle } from "./Style";
import * as Y from "yjs";
import { getOrCreate } from "@uimix/foundation/src/utils/Collection";
import { computed, makeObservable, observable } from "mobx";
import { Rect } from "paintvec";
import { resizeWithBoundingBox } from "../services/resizeWithBoundingBox";
import * as Data from "../data/v1";
import { Project } from "./Project";
import { Component, Variant } from "./Component";
import { ObjectData } from "./ObjectData";
import { Page } from "./Page";
import {
  buildNodeCSS,
  SelfAndChildrenCSS,
  StyleProps,
} from "@uimix/elements-react";

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
    this.data = new ObjectData(
      this.selectable.id,
      this.selectable.selectableMap.stylesData
    );
  }

  readonly selectable: Selectable;
  readonly data: ObjectData<Data.Style>;
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

  @computed get page(): Page | undefined {
    if (this.originalNode.type === "page") {
      return Page.from(this.originalNode);
    }
    return this.parent?.page;
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
    let superSelectable: Selectable | undefined;

    if (this.idPath.length === 1) {
      superSelectable = this.mainComponent?.rootNode.selectable;
    } else {
      superSelectable = this.project.selectables.get(this.idPath.slice(1));
    }

    if (superSelectable) {
      if (
        superSelectable.idPath.length === 1 &&
        superSelectable.originalNode.parent?.type === "component"
      ) {
        // super selectable is a component root node or a variant

        return new CascadedStyle(
          this.selfStyle,
          new CascadedStyle({ position: null }, superSelectable.style)
        );
      }

      return new CascadedStyle(this.selfStyle, superSelectable.style);
    }

    return new CascadedStyle(this.selfStyle, defaultStyle);
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

  private get mainComponentID(): string | null {
    if (this.selfStyle.mainComponent) {
      return this.selfStyle.mainComponent;
    }
    if (this.idPath.length === 1) {
      return null;
    }
    const superSelectable = this.project.selectables.get(this.idPath.slice(1));
    return superSelectable.mainComponentID;
  }

  @computed get mainComponent(): Component | undefined {
    const originalNode = this.originalNode;
    if (originalNode.type === "instance") {
      const mainComponentID = this.mainComponentID;
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
      return !!this.style.position;
    }
    return true;
  }

  createBefore(type: Data.NodeType, next: Selectable | undefined): Selectable {
    const node = this.project.nodes.create(type);
    this.originalNode.insertBefore([node], next?.originalNode);
    return this.project.selectables.get([node.id]);
  }

  append(type: Data.NodeType): Selectable {
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

  @computed.struct get usedImageHashes(): Set<string> {
    const result = new Set<string>();

    const { style } = this;
    if (style.imageHash) {
      result.add(style.imageHash);
    }

    for (const child of this.children) {
      for (const hash of child.usedImageHashes) {
        result.add(hash);
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

    const originalVariantCorresponding = this.originalVariantCorresponding;

    if (originalVariantCorresponding.idPath.length > 1) {
      console.log(
        'TODO: moving items into an instance content is not supported yet"'
      );
      return;
    }

    originalVariantCorresponding.node.insertBefore(
      selectables.map((s) => s.originalNode),
      dstNextSibling?.originalNode
    );

    if (fixPosition) {
      for (const selectable of selectables) {
        if (selectable.isAbsolute) {
          const bbox = selectable.computedRect;
          resizeWithBoundingBox(selectable, bbox, { x: true, y: true });
        }
      }

      if (this.style.layout !== "none") {
        for (const selectable of selectables) {
          if (!selectable.style.preferAbsolute) {
            selectable.style.position = null;
          }
        }
      }
    }
  }

  get ownerComponent(): Component | undefined {
    if (this.originalNode.type === "component") {
      return Component.from(this.originalNode);
    }
    return this.parent?.ownerComponent;
  }

  get originalVariantCorresponding(): Selectable {
    if (this.nodePath[0].type === "variant") {
      return this.superSelectable ?? this;
    }
    return this;
  }

  get variantCorrespondings(): { variant?: Variant; selectable: Selectable }[] {
    const original = this.originalVariantCorresponding;
    const component = original.ownerComponent;
    if (!component) {
      return [{ selectable: this }];
    }

    if (component.rootNode === original.originalNode) {
      return [
        { selectable: component.rootNode.selectable },
        ...component.variants.map((v) => ({
          variant: v,
          selectable: v.selectable,
        })),
      ];
    }

    return [
      {
        selectable: original,
      },
      ...component.variants.map((v) => ({
        variant: v,
        selectable: this.selectableMap.get([v.node.id, ...original.idPath]),
      })),
    ];
  }

  toJSON(): Data.Selectable {
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

  static fromJSON(project: Project, json: Data.Selectable): Selectable {
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

  buildCSS(
    getColorToken: (id: string) => string = (tokenID) =>
      this.project.colorTokens.resolve(tokenID)
  ): SelfAndChildrenCSS {
    const style = { ...defaultStyle, ...this.style.toJSON() };

    const nodeType = this.node.type;
    const resolveColor = (color: Data.Color): string => {
      if (typeof color === "string") {
        return color;
      }
      return getColorToken(color.token);
    };
    const resolveFill = (fill: Data.Fill): StyleProps["fills"][number] => {
      return {
        solid: resolveColor(fill.solid),
      };
    };

    if (nodeType === "component") {
      return {
        self: {},
        children: {},
      };
    }

    const resolvedStyle: StyleProps = {
      ...style,
      fills: style.fills.map(resolveFill),
      border: style.border && resolveFill(style.border),
      shadows: style.shadows.map((shadow) => ({
        ...shadow,
        color: resolveColor(shadow.color),
      })),
      image: null,
    };

    return buildNodeCSS(
      nodeType as "frame" | "text" | "image" | "svg",
      resolvedStyle
    );
  }
}

export class SelectableMap {
  constructor(project: Project) {
    this.project = project;
  }

  get stylesData(): ObservableYMap<Y.Map<Data.Style[keyof Data.Style]>> {
    return ObservableYMap.get(this.project.data.styles);
  }
  get selectionData(): ObservableYMap<true> {
    return ObservableYMap.get(this.project.data.selection);
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
): Data.Project {
  const nodeJSONs: Record<string, Data.Node> = {};
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
    componentURLs: [],
    images: {},
    colors: {},
  };
}
