import { reaction } from "mobx";
import { Component } from "../models/Component";
import { ElementInstance } from "../models/ElementInstance";
import { DefaultVariant, Variant } from "../models/Variant";
import { ChildMountSync, fetchComputedValues } from "./ElementMount";
import { MountContext } from "./MountContext";

export class VariantMount {
  constructor(
    component: Component,
    variant: Variant | DefaultVariant,
    styleSheet: CSSStyleSheet,
    context: MountContext
  ) {
    this.component = component;
    this.variant = variant;
    this.context = context;

    this.dom = context.domDocument.createElement("div");
    this.host = context.domDocument.createElement("div");
    this.shadow = this.host.attachShadow({ mode: "open" });
    // @ts-ignore
    this.shadow.adoptedStyleSheets = [styleSheet];
    this.dom.append(this.host);

    this.dom.style.position = "absolute";
    this.dom.style.background = "white";
    this.dom.style.display = "flex";

    // TODO: add style

    this.childMountSync = new ChildMountSync(
      ElementInstance.get(variant, component.rootElement),
      context,
      this.shadow,
      () => this.updateBoundingBoxLater()
    );
    context.registry.setVariantMount(this);

    this.disposers.push(
      reaction(
        () => ({
          x: this.variant.x,
          y: this.variant.y,
          width: this.variant.width,
          height: this.variant.height,
        }),
        ({ x, y, width, height }) => {
          this.dom.style.left = `${x}px`;
          this.dom.style.top = `${y}px`;
          this.dom.style.width =
            width === undefined ? `fit-content` : `${width}px`;
          this.dom.style.height =
            height === undefined ? `fit-content` : `${height}px`;
        },
        { fireImmediately: true }
      )
    );
  }

  dispose(): void {
    if (this.isDisposed) {
      throw new Error("VariantMount is already disposed");
    }

    this.disposers.forEach((disposer) => disposer());

    this.childMountSync.dispose();
    this.context.registry.deleteVariantMount(this);

    this.isDisposed = true;
  }

  private isDisposed = false;
  private readonly disposers: (() => void)[] = [];

  readonly component: Component;
  readonly variant: Variant | DefaultVariant;
  readonly context: MountContext;

  readonly dom: HTMLDivElement;
  private readonly host: HTMLDivElement;
  private readonly shadow: ShadowRoot;

  private readonly childMountSync: ChildMountSync;

  updateBoundingBoxLater(): void {
    this.context.boundingBoxUpdateScheduler.schedule(this);
  }

  updateBoundingBox(): void {
    const { rootInstance } = this.variant;
    if (rootInstance) {
      fetchComputedValues(rootInstance, this.host, this.context);
    }

    for (const childMount of this.childMountSync.childMounts) {
      childMount.updateBoundingBox();
    }
  }
}
