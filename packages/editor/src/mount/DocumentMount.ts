import { reaction } from "mobx";
import dedent from "dedent";
import { Component } from "../models/Component";
import { EditorState } from "../state/EditorState";
import { BoundingBoxUpdateScheduler } from "./BoundingBoxUpdateScheduler";
import { ComponentMount } from "./ComponentMount";
import { MountRegistry } from "./MountRegistry";

// minimal CSS reset
const resetCSS = dedent`
  :host {
    box-sizing: border-box;
  }
  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }
  [hidden] {
    display: none !important;
  }
`;

export class DocumentMount {
  constructor(editorState: EditorState, domDocument: globalThis.Document) {
    this.editorState = editorState;
    this.dom = domDocument.createElement("div");
    this.resetStyleSheet = new domDocument.defaultView!.CSSStyleSheet();
    //@ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.resetStyleSheet.replaceSync(resetCSS);

    this.disposers = [
      reaction(
        () => editorState.document.components.children,
        (components) => {
          this.updateComponents(components);
        }
      ),
    ];
    this.updateComponents(editorState.document.components.children);
  }

  dispose(): void {
    if (this.isDisposed) {
      throw new Error("DocumentMount is already disposed");
    }

    this.componentMounts.forEach((mount) => mount.dispose());
    this.disposers.forEach((disposer) => disposer());

    this.isDisposed = true;
  }

  private updateComponents(components: readonly Component[]): void {
    const oldMounts = new Map<Component, ComponentMount>();

    for (const mount of this.componentMounts) {
      oldMounts.set(mount.component, mount);
    }
    this.componentMounts = [];

    for (const component of components) {
      const variantMount =
        oldMounts.get(component) ||
        new ComponentMount(component, {
          domDocument: this.dom.ownerDocument,
          resetStyleSheet: this.resetStyleSheet,
          editorState: this.editorState,
          registry: this.registry,
          boundingBoxUpdateScheduler: this.boundingBoxUpdateScheduler,
        });
      oldMounts.delete(component);
      this.componentMounts.push(variantMount);
    }

    for (const variantMount of oldMounts.values()) {
      variantMount.dispose();
    }

    while (this.dom.firstChild) {
      this.dom.firstChild.remove();
    }
    for (const mount of this.componentMounts) {
      this.dom.append(mount.dom);
    }
  }

  private isDisposed = false;
  private readonly disposers: (() => void)[] = [];

  readonly editorState: EditorState;
  readonly dom: HTMLDivElement;
  readonly registry = new MountRegistry();
  readonly boundingBoxUpdateScheduler = new BoundingBoxUpdateScheduler();
  private resetStyleSheet: CSSStyleSheet;
  private componentMounts: ComponentMount[] = [];
}
