import { ElementInstance } from "../models/ElementInstance";
import { Variant } from "../models/Variant";
import { ChildMountSync } from "./ElementMount";
import { MountRegistry } from "./MountRegistry";

export class VariantMount {
  constructor(variant: Variant, registry: MountRegistry) {
    this.variant = variant;
    this.registry = registry;
    this.element.append(this.host);

    // TODO: add style

    this.childMountSync = new ChildMountSync(
      ElementInstance.get(variant, variant.component.rootElement),
      this.shadow,
      registry
    );
    registry.setVariantMount(this);
  }

  dispose(): void {
    this.childMountSync.dispose();
    this.registry.deleteVariantMount(this);
  }

  readonly variant: Variant;
  readonly registry: MountRegistry;

  readonly element = document.createElement("div");
  readonly host = document.createElement("div");
  readonly shadow = this.host.attachShadow({ mode: "open" });

  readonly childMountSync: ChildMountSync;
}
