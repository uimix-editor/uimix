import { TreeNode } from "@seanchas116/paintkit/src/util/TreeNode";
import { computed, makeObservable, observable } from "mobx";
import shortUUID from "short-uuid";
import { Component, VariantList } from "./Component";
import { ElementInstance } from "./ElementInstance";
import { getInstance } from "./InstanceRegistry";

export interface BaseVariantJSON {
  x: number;
  y: number;
  width?: number;
  height?: number;
  backgroundColor?: string;
}

abstract class BaseVariant extends TreeNode<VariantList, BaseVariant, never> {
  constructor() {
    super();
    makeObservable(this);
  }

  abstract get component(): Component | undefined;

  get rootInstance(): ElementInstance | undefined {
    return (
      this.component &&
      getInstance(
        this as BaseVariant as Variant | DefaultVariant,
        this.component.rootElement
      )
    );
  }

  @observable x = 0;
  @observable y = 0;
  @observable width: number | undefined = undefined;
  @observable height: number | undefined = undefined;
  @observable backgroundColor: string | undefined = undefined;

  abstract get name(): string;

  toJSON(): BaseVariantJSON {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      backgroundColor: this.backgroundColor,
    };
  }

  loadJSON(json: BaseVariantJSON): void {
    this.x = json.x;
    this.y = json.y;
    this.width = json.width;
    this.height = json.height;
    this.backgroundColor = json.backgroundColor;
  }
}

export class DefaultVariant extends BaseVariant {
  constructor(component: Component) {
    super();
    this._component = component;
  }

  private _component: Component;
  get component(): Component {
    return this._component;
  }

  get rootInstance(): ElementInstance {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return super.rootInstance!;
  }

  get type(): "defaultVariant" {
    return "defaultVariant";
  }

  get name(): string {
    return "default";
  }
}

export class Variant extends BaseVariant {
  constructor(key?: string) {
    super();
    this.key = key ?? shortUUID.generate();
    makeObservable(this);
  }

  get component(): Component | undefined {
    return this.parent?.component;
  }

  get type(): "variant" {
    return "variant";
  }

  readonly key: string;

  @observable selector = "";
  @observable mediaQuery = "";

  @computed get name(): string {
    if (this.selector && this.mediaQuery) {
      return `${this.mediaQuery} ${this.selector}`;
    }
    if (this.selector) {
      return this.selector;
    }
    if (this.mediaQuery) {
      return this.mediaQuery;
    }
    return "";
  }

  toJSON(): VariantJSON {
    return {
      key: this.key,
      selector: this.selector || undefined,
      mediaQuery: this.mediaQuery || undefined,
      ...super.toJSON(),
    };
  }

  loadJSON(json: VariantJSON): void {
    if (json.key !== this.key) {
      throw new Error("Variant key mismatch");
    }

    this.selector = json.selector || "";
    this.mediaQuery = json.mediaQuery || "";
    super.loadJSON(json);
  }

  extends(other: Variant): boolean {
    if (this.selector === other.selector) {
      return isMediaQueryExtendsOther(this.mediaQuery, other.mediaQuery);
    }
    if (this.mediaQuery === other.mediaQuery) {
      return isSelectorExtendsOther(this.selector, other.selector);
    }
    return (
      isSelectorExtendsOther(this.selector, other.selector) &&
      isMediaQueryExtendsOther(this.mediaQuery, other.mediaQuery)
    );
  }

  get supersetVariants(): Variant[] {
    return (
      this.parent?.children.filter(
        (variant) => variant !== this && variant.extends(this)
      ) ?? []
    );
  }
}

export interface VariantJSON extends BaseVariantJSON {
  key: string;
  selector?: string;
  mediaQuery?: string;
}

// selector ⊂ otherSelector
function isSelectorExtendsOther(
  selector: string,
  otherSelector: string
): boolean {
  if (!otherSelector) {
    return true;
  }
  if (!selector) {
    return false;
  }

  // TODO: better check
  return selector !== otherSelector && selector.includes(otherSelector);
}

// mediaQuery ⊂ otherMediaQuery
function isMediaQueryExtendsOther(
  mediaQuery: string,
  otherMediaQuery: string
): boolean {
  if (!otherMediaQuery) {
    return true;
  }
  if (!mediaQuery) {
    return false;
  }

  // TODO: support other media queries

  const maxWidth = parseInt(
    mediaQuery.split("(max-width:")[1].split(")")[0],
    10
  );
  const otherMaxWidth = parseInt(
    otherMediaQuery.split("(max-width:")[1].split(")")[0],
    10
  );
  return maxWidth < otherMaxWidth;
}

export function solveVariantDependencies(
  variants: Variant[]
): Map<Variant, Variant[]> {
  const visited = new Set<Variant>();
  const depsMap = new Map<Variant, Variant[]>();

  const visit = (variant: Variant): void => {
    console.log("visit", variant.key);
    if (visited.has(variant)) {
      return;
    }

    const deps = variants.filter(
      (variant2) => variant2 !== variant && variant.extends(variant2)
    );
    depsMap.set(variant, deps);
    console.log(
      "deps",
      deps.map((v) => v.key)
    );

    if (deps.length > 0) {
      deps.forEach(visit);
    }

    visited.add(variant);
  };

  variants.forEach(visit);

  const sorted = [...visited].reverse();

  for (const key of [...depsMap.keys()]) {
    const deps = new Set(depsMap.get(key));
    const sortedDeps = sorted.filter((variant) => deps.has(variant));
    depsMap.set(key, sortedDeps);
  }

  return depsMap;
}
