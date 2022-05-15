import { reaction, runInAction } from "mobx";
import dedent from "dedent";
import { assertNonNull } from "@seanchas116/paintkit/src/util/Assert";
import { Component } from "../models/Component";
import { EditorState } from "../state/EditorState";
import { Document, LoadedCustomElement } from "../models/Document";
import { captureDOM } from "../util/CaptureDOM";
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
  constructor(editorState: EditorState, document: Document, parent: Element) {
    this.editorState = editorState;
    this.document = document;

    this.iframe = globalThis.document.createElement("iframe");
    this.iframe.style.position = "absolute";
    this.iframe.style.top = "0";
    this.iframe.style.left = "0";
    this.iframe.style.width = "100%";
    this.iframe.style.height = "100%";
    parent.append(this.iframe);

    const domDocument = assertNonNull(this.iframe.contentDocument);
    editorState.elementPicker.root = domDocument;
    domDocument.body.style.margin = "0";

    this.container = domDocument.createElement("div");
    this.container.style.position = "absolute";
    this.container.style.top = "0";
    this.container.style.left = "0";
    this.container.style.transformOrigin = "left top";
    domDocument.body.append(this.container);

    const domWindow = domDocument.defaultView!;

    this.resetStyleSheet = new domDocument.defaultView!.CSSStyleSheet();
    //@ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.resetStyleSheet.replaceSync(resetCSS);

    const customElementTagNames: string[] = [];

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const originalDefine = domWindow.customElements.define;
    domWindow.customElements.define = function (...args) {
      customElementTagNames.push(args[0]);
      console.log("define", args);
      originalDefine.apply(this, args);
    };

    const loadPreludeScript = (src: string): Promise<void> => {
      return new Promise<void>((resolve, reject) => {
        const script = domDocument.createElement("script");
        script.type = "module";
        script.src = editorState.resolveImageAssetURL(src);
        script.addEventListener("load", () => resolve());
        script.addEventListener("error", (e) => reject(e));
        domDocument.head.append(script);
      }).catch((e) => console.error(e));
    };

    void Promise.all(
      document.preludeScripts.map((src) => loadPreludeScript(src))
    ).then(() => {
      void this.updateCustomElementThumbnails(customElementTagNames);
    });

    this.disposers = [
      reaction(
        () => editorState.scroll.documentToViewport,
        (transform) => {
          this.container.style.transform = transform.toCSSMatrixString();
        }
      ),
      reaction(
        () => document.components.children,
        (components) => {
          this.updateComponents(components);
        }
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
    this.iframe.remove();

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

    while (this.container.firstChild) {
      this.container.firstChild.remove();
    }
    for (const mount of this.componentMounts) {
      this.container.append(mount.dom);
    }
  }

  private get context(): MountContext {
    return {
      domDocument: this.container.ownerDocument,
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
  readonly iframe: HTMLIFrameElement;
  readonly container: HTMLDivElement;
  readonly registry = new MountRegistry();
  readonly boundingBoxUpdateScheduler = new BoundingBoxUpdateScheduler();
  private resetStyleSheet: CSSStyleSheet;
  private componentMounts: ComponentMount[] = [];
  private componentStyleMounts = new Map<Component, ComponentStyleMount>();

  private async updateCustomElementThumbnails(
    tagNames: string[]
  ): Promise<void> {
    const renderThumbnail = async (
      tagName: string
    ): Promise<LoadedCustomElement> => {
      const doc = this.container.ownerDocument;
      const elem = doc.createElement(tagName);
      elem.append("Content");

      const container = doc.createElement("div");
      container.style.position = "absolute";
      container.style.top = "-10000px";
      container.style.left = "-10000px";
      container.style.display = "flex";
      container.style.fontFamily = "sans-serif";
      container.append(elem);

      doc.body.append(container);

      await new Promise((resolve) => setTimeout(resolve, 100));

      try {
        const thumbnail = await captureDOM(elem, 512);
        container.remove();
        return {
          tagName,
          thumbnail,
        };
      } catch (e) {
        console.error(e);
        container.remove();
        return {
          tagName,
        };
      }
    };

    const elements = await Promise.all(tagNames.map(renderThumbnail));

    runInAction(() => {
      this.document.loadedCustomElements.replace(elements);
    });
  }
}
