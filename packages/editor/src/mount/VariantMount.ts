import { ElementInstance } from "../models/ElementInstance";
import { DefaultVariant, Variant } from "../models/Variant";
import { ChildMountSync } from "./ElementMount";
import { MountRegistry } from "./MountRegistry";

export class VariantMount {
  constructor(
    variant: Variant | DefaultVariant,
    registry: MountRegistry,
    domDocument: globalThis.Document
  ) {
    this.variant = variant;
    this.registry = registry;
    this.domDocument = domDocument;

    this.element = domDocument.createElement("div");
    this.host = domDocument.createElement("div");
    this.shadow = this.host.attachShadow({ mode: "open" });
    this.element.append(this.host);

    domDocument.body.append(this.element);

    // TODO: add style

    this.childMountSync = new ChildMountSync(
      ElementInstance.get(variant, variant.component.rootElement),
      registry,
      this.shadow
    );
    registry.setVariantMount(this);
  }

  dispose(): void {
    if (this.isDisposed) {
      throw new Error("VariantMount is already disposed");
    }

    this.childMountSync.dispose();
    this.registry.deleteVariantMount(this);
    this.element.remove();

    this.isDisposed = true;
  }

  private isDisposed = false;

  readonly variant: Variant | DefaultVariant;
  readonly registry: MountRegistry;
  readonly domDocument: globalThis.Document;

  readonly element: HTMLDivElement;
  private readonly host: HTMLDivElement;
  private readonly shadow: ShadowRoot;

  private readonly childMountSync: ChildMountSync;
}
