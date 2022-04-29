import { filterInstance } from "@seanchas116/paintkit/src/util/Collection";
import { reaction } from "mobx";
import { Rect } from "paintvec";
import { Component } from "../models/Component";
import { ElementInstance } from "../models/ElementInstance";
import { DefaultVariant, Variant } from "../models/Variant";
import { ChildMountSync } from "./ElementMount";
import { MountContext } from "./MountContext";

export class VariantMount {
  constructor(
    component: Component,
    variant: Variant | DefaultVariant,
    context: MountContext,
    domDocument: globalThis.Document
  ) {
    this.component = component;
    this.variant = variant;
    this.context = context;
    this.domDocument = domDocument;

    this.dom = domDocument.createElement("div");
    this.host = domDocument.createElement("div");
    this.shadow = this.host.attachShadow({ mode: "open" });
    this.styleSheet = new domDocument.defaultView!.CSSStyleSheet();
    // @ts-ignore
    this.shadow.adoptedStyleSheets = [this.styleSheet];
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
        () =>
          filterInstance(this.variant.rootInstance!.allDescendants, [
            ElementInstance,
          ]),
        this.updateCSS.bind(this),
        { fireImmediately: true }
      ),
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
  readonly domDocument: globalThis.Document;

  readonly dom: HTMLDivElement;
  private readonly host: HTMLDivElement;
  private readonly shadow: ShadowRoot;
  private readonly styleSheet: CSSStyleSheet;

  private readonly childMountSync: ChildMountSync;

  updateBoundingBoxLater(): void {
    this.context.boundingBoxUpdateScheduler.schedule(this);
  }

  updateBoundingBox(): void {
    const viewportToDocument =
      this.context.editorState.scroll.viewportToDocument;

    const { rootInstance } = this.variant;
    if (rootInstance) {
      rootInstance.boundingBox = Rect.from(
        this.host.getBoundingClientRect()
      ).transform(viewportToDocument);
    }
  }

  updateCSS(instances: ElementInstance[]): void {
    for (let i = 0; i < this.styleSheet.cssRules.length; i++) {
      this.styleSheet.deleteRule(i);
    }

    for (const instance of instances) {
      const props = instance.style.toCSSString();
      if (instance === this.variant.rootInstance) {
        this.styleSheet.insertRule(`:host { ${props} }`);
      } else {
        const id = instance.element.id;
        this.styleSheet.insertRule(`#${id} { ${props} }`);
      }
    }
  }
}
