import { reaction } from "mobx";
import dedent from "dedent";
import { Component } from "../models/Component";
import { EditorState } from "../state/EditorState";
import { Document } from "../models/Document";
import { BoundingBoxUpdateScheduler } from "./BoundingBoxUpdateScheduler";
import { ComponentMount } from "./ComponentMount";
import { MountRegistry } from "./MountRegistry";
import { ComponentStyleMount } from "./ComponentStyleMount";
import { MountContext } from "./MountContext";

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
  constructor(
    editorState: EditorState,
    document: Document,
    domDocument: globalThis.Document
  ) {
    this.editorState = editorState;
    this.document = document;
    this.dom = domDocument.createElement("div");
    this.resetStyleSheet = new domDocument.defaultView!.CSSStyleSheet();
    //@ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.resetStyleSheet.replaceSync(resetCSS);

    for (const prelude of document.preludeScripts) {
      const script = domDocument.createElement("script");
      script.type = "module";
      script.src = editorState.resolveImageAssetURL(prelude);
      domDocument.head.append(script);
    }

    this.disposers = [
      reaction(
        () => document.components.children,
        (components) => {
          this.updateComponents(components);
        }
      ),
      reaction(
        () =>
          document.preludeScripts.map((url) =>
            editorState.resolveImageAssetURL(url)
          ),
        (preludeScripts) => {
          for (const prelude of preludeScripts) {
            const script = domDocument.createElement("script");
            script.type = "module";
            script.src = editorState.resolveImageAssetURL(prelude);
            domDocument.head.append(script);
          }
        },
        { fireImmediately: true }
      ),
    ];
    this.updateComponents(document.components.children);
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
    const context = this.context;

    {
      const oldStyleMounts = new Map(this.componentStyleMounts);
      this.componentStyleMounts.clear();
      for (const component of components) {
        const styleMount =
          oldStyleMounts.get(component) ||
          new ComponentStyleMount(component, context);
        this.componentStyleMounts.set(component, styleMount);

        oldStyleMounts.delete(component);
      }

      for (const styleMount of oldStyleMounts.values()) {
        styleMount.dispose();
      }
    }

    const oldMounts = new Map<Component, ComponentMount>();

    for (const mount of this.componentMounts) {
      oldMounts.set(mount.component, mount);
    }
    this.componentMounts = [];

    for (const component of components) {
      const variantMount =
        oldMounts.get(component) || new ComponentMount(component, context);
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

  private get context(): MountContext {
    return {
      domDocument: this.dom.ownerDocument,
      resetStyleSheet: this.resetStyleSheet,
      editorState: this.editorState,
      registry: this.registry,
      boundingBoxUpdateScheduler: this.boundingBoxUpdateScheduler,
      componentStyleMounts: this.componentStyleMounts,
    };
  }

  private isDisposed = false;
  private readonly disposers: (() => void)[] = [];

  readonly editorState: EditorState;
  readonly document: Document;
  readonly dom: HTMLDivElement;
  readonly registry = new MountRegistry();
  readonly boundingBoxUpdateScheduler = new BoundingBoxUpdateScheduler();
  private resetStyleSheet: CSSStyleSheet;
  private componentMounts: ComponentMount[] = [];
  private componentStyleMounts = new Map<Component, ComponentStyleMount>();
}
