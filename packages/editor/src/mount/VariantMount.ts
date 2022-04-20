import { Variant } from "../models/Variant";
import { ElementMount } from "./ElementMount";
import { MountRegistry } from "./MountRegistry";

export class VariantMount {
  constructor(variant: Variant, registry: MountRegistry) {
    this.variant = variant;
    this.registry = registry;
    this.rootMount = new ElementMount(
      variant.component.rootElement,
      variant,
      registry
    );
    this.element.append(this.host);

    // WIP
  }

  readonly variant: Variant;
  readonly registry: MountRegistry;
  readonly rootMount: ElementMount;

  readonly element = document.createElement("div");
  readonly host = document.createElement("div");
  readonly shadow = this.host.attachShadow({ mode: "open" });
}
