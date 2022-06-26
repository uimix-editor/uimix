import { assertNonNull } from "@seanchas116/paintkit/src/util/Assert";
import { computed, reaction } from "mobx";
import { Component } from "../models/Component";
import { ElementInstance } from "../models/ElementInstance";
import { DefaultVariant, Variant } from "../models/Variant";
import { parseMaxWidth } from "../util/parseMaxWidth";
import { ChildMountSync, fetchComputedValues } from "./ElementMount";
import { MountContext } from "./MountContext";

export class RootElementMount {
  private static domToMount = new WeakMap<
    globalThis.Element,
    RootElementMount
  >();

  static forDOM(dom: globalThis.Element): RootElementMount | undefined {
    return this.domToMount.get(dom);
  }

  constructor(
    component: Component,
    variant: Variant | DefaultVariant,
    context: MountContext,
    dom?: HTMLElement
  ) {
    this.component = component;
    this.variant = variant;
    this.context = context;
    this.instance = variant.rootInstance!;

    const styleSheet = assertNonNull(
      this.context.componentStyleMounts.get(component)
    ).styleSheet;

    this.dom = dom ?? context.domDocument.createElement("span");
    RootElementMount.domToMount.set(this.dom, this);

    this.shadow = this.dom.attachShadow({ mode: "open" });
    // @ts-ignore
    this.shadow.adoptedStyleSheets = [context.resetStyleSheet, styleSheet];

    this.disposers.push(
      reaction(
        () => this.classNames,
        (classNames) => {
          this.dom.className = classNames.join(" ");
        },
        {
          fireImmediately: true,
        }
      )
    );

    this.childMountSync = new ChildMountSync(this, this.shadow, () =>
      this.updateBoundingBoxLater()
    );
  }

  dispose(): void {
    if (this.isDisposed) {
      throw new Error("VariantMount is already disposed");
    }

    this.disposers.forEach((disposer) => disposer());

    this.childMountSync.dispose();

    this.isDisposed = true;
  }

  private isDisposed = false;
  private readonly disposers: (() => void)[] = [];

  readonly component: Component;
  readonly variant: Variant | DefaultVariant;
  readonly instance: ElementInstance;
  readonly context: MountContext;

  readonly dom: HTMLElement;
  readonly shadow: ShadowRoot;

  private readonly childMountSync: ChildMountSync;

  get type(): "rootElement" {
    return "rootElement";
  }

  get parent(): undefined {
    return undefined;
  }

  get root(): RootElementMount {
    return this;
  }

  updateBoundingBoxLater(): void {
    this.context.boundingBoxUpdateScheduler?.schedule(this);
  }

  updateBoundingBox(): void {
    const { rootInstance } = this.variant;
    if (rootInstance) {
      fetchComputedValues(rootInstance, this.dom, this.context);
    }

    for (const childMount of this.childMountSync.childMounts) {
      childMount.updateBoundingBox();
    }
  }

  @computed get classNames(): string[] {
    if (this.variant.type === "variant") {
      const enabledVariants = [this.variant, ...this.variant.supersetVariants];
      return enabledVariants.map((v) => `variant-${v.key}`);
    }

    if (this.context.topLevelVariant?.type === "variant") {
      const maxWidth = parseMaxWidth(this.context.topLevelVariant.mediaQuery);
      if (!isNaN(maxWidth)) {
        const enabledVariants = this.component.variants.children.filter(
          (v) => parseMaxWidth(v.mediaQuery) >= maxWidth
        );
        return enabledVariants.map((v) => `variant-${v.key}`);
      }
    }

    return [];
  }
}
