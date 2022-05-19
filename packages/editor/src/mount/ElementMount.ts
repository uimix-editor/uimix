import { computed, reaction } from "mobx";
import { Rect } from "paintvec";
import { kebabCase } from "lodash-es";
import { isSVGTagName } from "@seanchas116/paintkit/src/util/HTMLTagCategory";
import { Element } from "../models/Element";
import { Text } from "../models/Text";
import { ElementInstance } from "../models/ElementInstance";
import { styleKeys } from "../models/Style";
import { getInstance } from "../models/InstanceRegistry";
import { Component } from "../models/Component";
import { TextMount } from "./TextMount";
import { MountContext } from "./MountContext";
import { RootElementMount } from "./RootElementMount";

export class ChildMountSync {
  constructor(
    mount: ElementMount | RootElementMount,
    dom: HTMLElement | SVGElement | ShadowRoot,
    onUpdateChildren?: () => void
  ) {
    this.mount = mount;
    this.dom = dom;
    this.onUpdateChildren = onUpdateChildren;
    this.updateChildren(mount.instance.element.children);
    this.disposers = [
      reaction(
        () => mount.instance.element.children,
        (children) => {
          this.updateChildren(children);
        }
      ),
    ];
  }

  private updateChildren(children: readonly (Element | Text)[]) {
    const existingElementMounts = new Map<Element, ElementMount>();
    const existingTextMounts = new Map<Text, TextMount>();

    for (const childMount of this.childMounts) {
      if (childMount.type === "element") {
        existingElementMounts.set(childMount.instance.element, childMount);
      } else {
        existingTextMounts.set(childMount.instance.text, childMount);
      }
    }

    const newChildMounts: (ElementMount | TextMount)[] = [];
    for (const child of children) {
      if (child.type === "element") {
        const existingElementMount = existingElementMounts.get(child);
        if (existingElementMount) {
          newChildMounts.push(existingElementMount);
          existingElementMounts.delete(child);
        } else {
          newChildMounts.push(
            new ElementMount(
              this.mount,
              getInstance(this.mount.instance.variant, child),
              this.mount.context
            )
          );
        }
      } else {
        const existingTextMount = existingTextMounts.get(child);
        if (existingTextMount) {
          newChildMounts.push(existingTextMount);
          existingTextMounts.delete(child);
        } else {
          newChildMounts.push(
            new TextMount(
              this.mount,
              getInstance(this.mount.instance.variant, child),
              this.mount.context
            )
          );
        }
      }
    }
    this._childMounts = newChildMounts;

    for (const elementMount of existingElementMounts.values()) {
      elementMount.dispose();
    }
    for (const textMount of existingTextMounts.values()) {
      textMount.dispose();
    }

    while (this.dom.firstChild) {
      this.dom.firstChild.remove();
    }
    for (const childMount of newChildMounts) {
      this.dom.append(childMount.dom);
    }

    this.onUpdateChildren?.();
  }

  dispose(): void {
    this.disposers.forEach((disposer) => disposer());
    this.childMounts.forEach((childMount) => childMount.dispose());
  }

  get childMounts(): (ElementMount | TextMount)[] {
    return this._childMounts;
  }

  private readonly mount: ElementMount | RootElementMount;
  private readonly dom: HTMLElement | SVGElement | ShadowRoot;
  private readonly onUpdateChildren?: () => void;
  private _childMounts: (ElementMount | TextMount)[] = [];
  private readonly disposers: (() => void)[] = [];
}

export class ElementMount {
  private static domToMount = new WeakMap<globalThis.Element, ElementMount>();

  static forDOM(dom: globalThis.Element): ElementMount | undefined {
    return this.domToMount.get(dom);
  }

  constructor(
    parent: RootElementMount | ElementMount,
    instance: ElementInstance,
    context: MountContext
  ) {
    this.parent = parent;
    this.instance = instance;
    // TODO: support reference to other component
    if (isSVGTagName(instance.element.tagName)) {
      this.dom = context.domDocument.createElementNS(
        "http://www.w3.org/2000/svg",
        instance.element.tagName
      );
    } else {
      this.dom = context.domDocument.createElement(instance.element.tagName);
    }
    ElementMount.domToMount.set(this.dom, this);
    this.context = context;
    this.context.registry?.setElementMount(this);

    this.childMountSync = new ChildMountSync(this, this.dom, () =>
      this.root.updateBoundingBoxLater()
    );

    this.dom.addEventListener("load", () => {
      this.root.updateBoundingBoxLater();
    });

    this.disposers.push(
      reaction(
        () => this.attributes,
        (attrs) => {
          for (const attribute of this.dom.attributes) {
            this.dom.removeAttribute(attribute.name);
          }
          for (const [key, value] of attrs) {
            this.dom.setAttribute(key, value);
          }
          this.root.updateBoundingBoxLater();
        },
        { fireImmediately: true }
      ),
      reaction(
        () =>
          this.instance.element.component?.document?.components.forName(
            this.instance.element.tagName
          ),
        this.attachComponent.bind(this),
        { fireImmediately: true }
      )
    );

    const resizeObserver = new ResizeObserver(() => {
      this.root.updateBoundingBoxLater();
    });
    resizeObserver.observe(this.dom);
    this.disposers.push(() => resizeObserver.disconnect());
  }

  @computed get attributes(): Map<string, string> {
    const attributes = new Map<string, string>();

    for (const [key, value] of this.instance.element.attrs) {
      if (this.instance.element.tagName === "img" && key === "src") {
        const resolved = this.context.editorState.resolveImageAssetURL(value);
        if (resolved) {
          attributes.set(key, resolved);
        }
      } else {
        attributes.set(key, value);
      }
    }

    attributes.set("id", this.instance.element.id);

    return attributes;
  }

  dispose(): void {
    if (this.isDisposed) {
      throw new Error("ElementMount is already disposed");
    }

    this.disposers.forEach((disposer) => disposer());
    this.childMountSync.dispose();
    this.context.registry?.deleteElementMount(this);

    this.isDisposed = true;
  }

  get type(): "element" {
    return "element";
  }

  get root(): RootElementMount {
    return this.parent.root;
  }

  updateBoundingBox(): void {
    fetchComputedValues(this.instance, this.dom, this.context);

    for (const childMount of this.childMountSync.childMounts) {
      childMount.updateBoundingBox();
    }
  }

  attachComponent(component: Component | undefined): void {
    this.attachedMount?.dispose();
    this.attachedMount = undefined;

    if (component) {
      this.attachedMount = new RootElementMount(
        component,
        component?.defaultVariant,
        {
          ...this.context,
          boundingBoxUpdateScheduler: undefined,
          registry: undefined,
        },
        this.dom as HTMLElement
      );
    }
  }

  private isDisposed = false;
  private readonly disposers: (() => void)[] = [];
  readonly parent: RootElementMount | ElementMount;
  readonly instance: ElementInstance;
  readonly context: MountContext;
  readonly dom: HTMLElement | SVGElement;
  private readonly childMountSync: ChildMountSync;
  private attachedMount: RootElementMount | undefined;
}

export function fetchComputedValues(
  instance: ElementInstance,
  dom: HTMLElement | SVGElement,
  context: MountContext
): void {
  const viewportToDocument = context.editorState.scroll.viewportToDocument;

  instance.boundingBox = Rect.from(dom.getBoundingClientRect()).transform(
    viewportToDocument
  );

  const computedStyle = getComputedStyle(dom);
  for (const key of styleKeys) {
    instance.computedStyle[key] = computedStyle.getPropertyValue(
      kebabCase(key)
    );
  }
}
