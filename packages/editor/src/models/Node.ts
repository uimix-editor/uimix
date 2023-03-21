import { ObservableYMap } from "../utils/ObservableYMap";
import * as Y from "yjs";
import { ObservableRBTree } from "../utils/ObservableRBTree";
import { NodeJSON, NodeType, VariantCondition } from "@uimix/node-data";
import { getOrCreate } from "../state/Collection";
import { generateID } from "../utils/ID";
import { computed, makeObservable } from "mobx";
import { Project } from "./Project";
import { Selectable } from "./Selectable";
import { Component } from "./Component";

interface NodeKey {
  index: number;
  id: string;
}

function compareNodeKey(a: NodeKey, b: NodeKey) {
  if (a.index === b.index) {
    return a.id.localeCompare(b.id);
  }
  return a.index - b.index;
}

export const abstractNodeTypes: NodeType[] = ["project", "page", "component"];
export const normalNodeTypes: NodeType[] = [
  "frame",
  "text",
  "image",
  "svg",
  "instance",
  "foreign",
];

export class Node {
  // Do not use this constructor directly
  constructor(project: Project, id: string) {
    this.project = project;
    this.nodeMap = project.nodes;
    this.id = id;

    makeObservable(this);
  }

  readonly project: Project;
  readonly nodeMap: NodeMap;
  readonly id: string;

  get data(): ObservableYMap<unknown> | undefined {
    return ObservableYMap.get(this.nodeMap.data.get(this.id));
  }

  get dataForWrite(): ObservableYMap<unknown> {
    return ObservableYMap.get(
      getOrCreate(this.nodeMap.data, this.id, () => new Y.Map())
    );
  }

  get sortKey(): NodeKey {
    return { index: this.index, id: this.id };
  }

  get parentID(): string | undefined {
    return this.data?.get("parent") as string | undefined;
  }

  get index(): number {
    return (this.data?.get("index") ?? 0) as number;
  }

  lastParentID: string | undefined;
  lastIndex = 0;

  get type(): NodeType {
    return (this.data?.get("type") ?? "frame") as NodeType;
  }

  get isAbstract(): boolean {
    return abstractNodeTypes.includes(this.type);
  }

  @computed get name(): string {
    return (this.data?.get("name") ?? "") as string;
  }

  set name(name: string | undefined) {
    if (name === undefined) {
      this.data?.delete("name");
    } else {
      this.dataForWrite.set("name", name);
    }
  }

  // Applicable only to variant nodes

  @computed get condition(): VariantCondition | undefined {
    return this.data?.get("condition") as VariantCondition | undefined;
  }

  set condition(selector: VariantCondition | undefined) {
    this.dataForWrite.set("condition", selector);
  }

  // parent / children

  get parent(): Node | undefined {
    return this.nodeMap.get(this.data?.get("parent") as string | undefined);
  }

  get childCount(): number {
    return this.nodeMap.getChildrenMap(this.id).size;
  }

  get children(): Node[] {
    const childrenMap = this.nodeMap.getChildrenMap(this.id);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return [...childrenMap.keys()].map((key) => this.nodeMap.get(key.id)!);
  }

  includes(node: Node): boolean {
    let current: Node | undefined = node;
    while (current) {
      if (current === this) {
        return true;
      }
      current = current.parent;
    }
    return false;
  }

  @computed get firstChild(): Node | undefined {
    const childrenMap = this.nodeMap.getChildrenMap(this.id);
    const firstID = childrenMap.min()?.[0].id;
    return this.nodeMap.get(firstID);
  }

  @computed get lastChild(): Node | undefined {
    const childrenMap = this.nodeMap.getChildrenMap(this.id);
    const lastID = childrenMap.max()?.[0].id;
    return this.nodeMap.get(lastID);
  }

  @computed get nextSibling(): Node | undefined {
    const { parentID } = this;
    if (parentID === undefined) {
      return;
    }
    const parentChildrenMap = this.nodeMap.getChildrenMap(parentID);
    const nextSiblingID = parentChildrenMap.next(this.sortKey)?.[0].id;
    return this.nodeMap.get(nextSiblingID);
  }

  @computed get previousSibling(): Node | undefined {
    const { parentID } = this;
    if (parentID === undefined) {
      return;
    }
    const parentChildrenMap = this.nodeMap.getChildrenMap(parentID);
    const previousSiblingID = parentChildrenMap.prev(this.sortKey)?.[0].id;
    return this.nodeMap.get(previousSiblingID);
  }

  canInsert(type: NodeType): boolean {
    if (this.type === "project") {
      return type === "page";
    }

    if (this.type === "component") {
      if (this.children.length === 0) {
        return type !== "variant";
      } else {
        return type === "variant";
      }
    }

    if (this.type === "page") {
      return type === "component" || normalNodeTypes.includes(type);
    }

    if (this.type === "frame") {
      return normalNodeTypes.includes(type);
    }

    return false;
  }

  insertBefore(nodes: Node[], next: Node | undefined) {
    for (const node of nodes) {
      if (this === node) {
        return;
      }
      if (node.includes(this)) {
        throw new Error("Cannot insert a node into one of its descendants");
      }
      if (!this.canInsert(node.type)) {
        throw new Error("Cannot insert a node of this type into this node");
      }
    }
    if (next && next.parent !== this) {
      throw new Error("Next node is not a child of this node");
    }

    const prev = next ? next.previousSibling : this.lastChild;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const index =
        prev && next
          ? mix(prev.index, next.index, (i + 1) / (nodes.length + 1))
          : prev
          ? prev.index + i + 1
          : next
          ? next.index - nodes.length + i
          : i;

      // TODO: transaction
      const data = node.dataForWrite;
      data.set("parent", this.id);
      data.set("index", index);
    }
  }

  append(nodes: Node[]) {
    this.insertBefore(nodes, undefined);
  }

  remove() {
    this.data?.delete("parent");
  }

  clear() {
    for (const child of this.children) {
      child.remove();
    }
  }

  /// JSON

  toJSON(): NodeJSON {
    return {
      type: this.type,
      name: this.name,
      condition: this.condition,
      parent: this.parentID,
      index: this.index,
    };
  }

  loadJSON(json: NodeJSON) {
    const data = this.dataForWrite;
    data.set("name", json.name);
    data.set("condition", json.condition);
    data.set("parent", json.parent);
    data.set("index", json.index);
  }

  /// Utility

  get isComponentRoot(): boolean {
    return this.parent?.type === "component" && this.type !== "variant";
  }

  get isVariant(): boolean {
    return this.parent?.type === "component" && this.type === "variant";
  }

  get ownerComponent(): Component | undefined {
    if (this.type === "component") {
      return Component.from(this);
    }
    return this.parent?.ownerComponent;
  }

  get selectable(): Selectable {
    return this.project.selectables.get([this.id]);
  }
}

export class NodeMap {
  constructor(project: Project) {
    this.project = project;

    const data = project.doc.getMap("nodes");

    data.observeDeep((events) => {
      for (const event of events) {
        const path = event.path;

        if (path.length === 0) {
          // change node
          for (const [id, change] of event.keys) {
            if (change.action === "add") {
              const node = getOrCreate(
                this.nodeMap,
                id,
                () => new Node(this.project, id)
              );
              this.nodeMap.set(id, node);
              this.insertToParentChildrenMap(node);
            } else if (change.action === "update") {
              const node = this.nodeMap.get(id);
              if (node) {
                this.removeFromParentChildrenMap(node);
                this.insertToParentChildrenMap(node);
              }
            } else if (change.action === "delete") {
              const node = this.nodeMap.get(id);
              if (node) {
                this.removeFromParentChildrenMap(node);
              }
            }
          }
        }
        if (path.length === 1) {
          if (event.keys.has("parent") || event.keys.has("index")) {
            const nodeId = path[0];
            const node = this.nodeMap.get(String(nodeId));
            if (node) {
              this.removeFromParentChildrenMap(node);
              this.insertToParentChildrenMap(node);
            }
          }
        }
      }
    });
  }

  readonly project: Project;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get data(): ObservableYMap<Y.Map<any>> {
    return ObservableYMap.get(this.project.doc.getMap("nodes"));
  }

  private readonly nodeMap = new Map<string, Node>();
  private readonly childrenMaps = new Map<
    string,
    ObservableRBTree<NodeKey, true>
  >();

  get(id: string | undefined): Node | undefined {
    return id !== undefined ? this.nodeMap.get(id) : undefined;
  }

  getOrThrow(id: string): Node {
    const node = this.get(id);
    if (!node) {
      throw new Error(`Node not found: ${id}`);
    }
    return node;
  }

  create(type: NodeType, id: string = generateID()): Node {
    const data = new Y.Map<unknown>();
    data.set("type", type);
    data.set("index", 0);
    this.data.set(id, data);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.nodeMap.get(id)!;
  }

  getOrCreate(type: NodeType, id: string): Node {
    let node = this.get(id);
    if (!node) {
      node = this.create(type, id);
    }
    return node;
  }

  getChildrenMap(parentID: string): ObservableRBTree<NodeKey, true> {
    return getOrCreate(
      this.childrenMaps,
      parentID,
      () => new ObservableRBTree(compareNodeKey)
    );
  }

  private removeFromParentChildrenMap(node: Node) {
    if (node.lastParentID) {
      const parentChildrenMap = this.getChildrenMap(node.lastParentID);
      parentChildrenMap.delete({
        index: node.lastIndex,
        id: node.id,
      });
    }
  }

  private insertToParentChildrenMap(node: Node) {
    const data = node.data;
    const parentID = data?.get("parent") as string | undefined;
    const index = (data?.get("index") ?? 0) as number;

    if (parentID && index !== undefined) {
      const parentChildrenMap = this.getChildrenMap(parentID);
      parentChildrenMap.set({ index, id: node.id }, true);
    }

    node.lastParentID = parentID;
    node.lastIndex = index ?? 0;
  }
}

function mix(a: number, b: number, t: number): number {
  return a * (1 - t) + b * t;
}
