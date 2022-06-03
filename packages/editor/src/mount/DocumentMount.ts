import { computed, makeObservable, reaction, runInAction } from "mobx";
import { assertNonNull } from "@seanchas116/paintkit/src/util/Assert";
import { resetCSS } from "../../../compiler/src/resetCSS";
import { Component } from "../models/Component";
import { EditorState } from "../state/EditorState";
import { Document } from "../models/Document";
import { captureDOM } from "../util/CaptureDOM";
import { CustomElementMetadata } from "../models/CustomElementMetadata";
import { BoundingBoxUpdateScheduler } from "./BoundingBoxUpdateScheduler";
import { ComponentMount } from "./ComponentMount";
import { MountRegistry } from "./MountRegistry";
import { ComponentStyleMount } from "./ComponentStyleMount";
import { MountContext } from "./MountContext";

function getGoogleFontLink(fontFamilies: string[]): string {
  const query = fontFamilies
    .map((family) => {
      return `family=${family
        .split(/\s/)
        .join("+")}:wght@100;200;300;400;500;600;700;800;900`;
    })
    .join("&");

  return `https://fonts.googleapis.com/css2?${query}`;
}

export class DocumentMount {
  constructor(editorState: EditorState, document: Document, parent: Element) {
    makeObservable(this);
    this.editorState = editorState;
    this.document = document;

    this.iframe = globalThis.document.createElement("iframe");
    this.iframe.style.position = "absolute";
    this.iframe.style.top = "0";
    this.iframe.style.left = "0";
    this.iframe.style.width = "100%";
    this.iframe.style.height = "100%";
    this.iframe.style.colorScheme = "none";
    parent.append(this.iframe);

    this.domDocument = assertNonNull(this.iframe.contentDocument);
    editorState.elementPicker.root = this.domDocument;
    this.domDocument.body.style.margin = "0";

    this.container = this.domDocument.createElement("div");
    this.container.style.position = "absolute";
    this.container.style.top = "0";
    this.container.style.left = "0";
    this.container.style.transformOrigin = "left top";
    this.domDocument.body.append(this.container);

    this.resetStyleSheet = new this.domDocument.defaultView!.CSSStyleSheet();
    //@ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.resetStyleSheet.replaceSync(resetCSS);

    void this.loadPreludeScripts();

    const fontLink = this.domDocument.createElement("link");
    fontLink.rel = "stylesheet";
    this.domDocument.head.append(fontLink);

    this.domDocument.fonts.addEventListener("loadingdone", () => {
      for (const componentMount of this.componentMounts) {
        for (const variantMount of componentMount.variantMounts) {
          variantMount.rootMount.updateBoundingBoxLater();
        }
      }
    });

    const globalStyle = this.domDocument.createElement("style");
    this.domDocument.head.append(globalStyle);

    this.disposers = [
      reaction(
        () => editorState.scroll.documentToViewport,
        (transform) => {
          this.container.style.transform = transform.toCSSMatrixString();
        },
        { fireImmediately: true }
      ),
      reaction(
        () => document.components.children,
        (components) => {
          this.updateComponents(components);
        },
        { fireImmediately: true }
      ),
      reaction(
        () => this.usedGoogleFonts,
        (googleFonts) => {
          fontLink.href = getGoogleFontLink(googleFonts);
        },
        { fireImmediately: true }
      ),
      reaction(
        () => document.cssVariables.toCSSRule(),
        (globalCSS) => {
          globalStyle.textContent = globalCSS.toString();
        },
        { fireImmediately: true }
      ),
    ];
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
      domDocument: this.domDocument,
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
  readonly domDocument: globalThis.Document;
  readonly container: HTMLDivElement;
  readonly registry = new MountRegistry();
  readonly boundingBoxUpdateScheduler = new BoundingBoxUpdateScheduler();
  private resetStyleSheet: CSSStyleSheet;
  private componentMounts: ComponentMount[] = [];
  private componentStyleMounts = new Map<Component, ComponentStyleMount>();

  @computed get usedGoogleFonts(): string[] {
    return [...this.document.usedFontFamilies].filter((font) =>
      this.editorState.googleFontFamilies.has(font)
    );
  }

  private async loadPreludeScripts(): Promise<void> {
    const customElementTagNames: string[] = [];

    const domWindow = this.domDocument.defaultView!;

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const originalDefine = domWindow.customElements.define;
    domWindow.customElements.define = function (...args) {
      customElementTagNames.push(args[0]);
      console.log("define", args);
      originalDefine.apply(this, args);
    };

    const loadPreludeScript = (src: string): Promise<void> => {
      return new Promise<void>((resolve, reject) => {
        const script = this.domDocument.createElement("script");
        script.type = "module";
        script.src = this.editorState.resolveImageAssetURL(src);
        script.addEventListener("load", () => resolve());
        script.addEventListener("error", (e) => reject(e));
        this.domDocument.head.append(script);
      }).catch((e) => console.error(e));
    };

    const loadPreludeStyleSheet = (href: string): Promise<void> => {
      return new Promise<void>((resolve, reject) => {
        const link = this.domDocument.createElement("link");
        link.rel = "stylesheet";
        link.href = this.editorState.resolveImageAssetURL(href);
        link.addEventListener("load", () => resolve());
        link.addEventListener("error", (e) => reject(e));
        this.domDocument.head.append(link);
      }).catch((e) => console.error(e));
    };

    await Promise.all([
      ...this.document.preludeStyleSheets.map((href) =>
        loadPreludeStyleSheet(href)
      ),
      ...this.document.preludeScripts.map((src) => loadPreludeScript(src)),
    ]);
    await this.updateCustomElementMetadatas(customElementTagNames);
  }

  private async updateCustomElementMetadatas(
    tagNames: string[]
  ): Promise<void> {
    const getMetadata = async (
      tagName: string
    ): Promise<CustomElementMetadata> => {
      const elem = this.domDocument.createElement(tagName);
      elem.append("Content");

      const container = this.domDocument.createElement("div");
      container.style.position = "absolute";
      container.style.top = "-10000px";
      container.style.left = "-10000px";
      container.style.display = "flex";
      container.style.fontFamily = "sans-serif";
      container.append(elem);

      this.domDocument.body.append(container);

      await new Promise((resolve) => setTimeout(resolve, 100));

      try {
        const thumbnail = await captureDOM(elem, 512);
        container.remove();
        return {
          tagName,
          thumbnail,
          cssVariables: [], // TODO
          slots: [
            {
              defaultContent: [
                {
                  type: "text",
                  value: "Content",
                },
              ],
            },
          ], // TODO
        };
      } catch (e) {
        console.error(e);
        container.remove();
        return {
          tagName,
          cssVariables: [], // TODO
          slots: [
            {
              defaultContent: [
                {
                  type: "text",
                  value: "Content",
                },
              ],
            },
          ], // TODO
        };
      }
    };

    const metadatas = await Promise.all(tagNames.map(getMetadata));

    runInAction(() => {
      this.document.loadedCustomElements.replace(metadatas);
    });
  }
}
