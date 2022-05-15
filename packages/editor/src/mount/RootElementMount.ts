import { assertNonNull } from "@seanchas116/paintkit/src/util/Assert";
import { Component } from "../models/Component";
import { ElementInstance } from "../models/ElementInstance";
import { getInstance } from "../models/InstanceRegistry";
import { DefaultVariant, Variant } from "../models/Variant";
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
    context: MountContext
  ) {
    this.component = component;
    this.variant = variant;
    this.context = context;
    this.instance = variant.rootInstance!;

    const styleSheet = assertNonNull(
      this.context.componentStyleMounts.get(component)
    ).styleSheet;

    this.dom = context.domDocument.createElement("div");
    RootElementMount.domToMount.set(this.dom, this);

    this.shadow = this.dom.attachShadow({ mode: "open" });
    // @ts-ignore
    this.shadow.adoptedStyleSheets = [context.resetStyleSheet, styleSheet];

    if (this.variant.type === "variant") {
      this.dom.classList.add("variant-" + this.variant.key);
    }

    this.childMountSync = new ChildMountSync(
      this,
      getInstance(variant, component.rootElement),
      context,
      this.shadow,
      () => this.updateBoundingBoxLater()
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

  readonly dom: HTMLDivElement;
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
    this.context.boundingBoxUpdateScheduler.schedule(this);
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
}
