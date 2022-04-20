import { Variant } from "../models/Variant";
import { ElementMount } from "./ElementMount";
import { MountRegistry } from "./MountRegistry";

export class VariantMount {
  constructor(variant: Variant) {
    this.variant = variant;
    this.rootMount = new ElementMount(
      variant.component.rootElement,
      this.registry
    );
    this.element.append(this.host);

    // WIP
  }

  readonly variant: Variant;
  readonly registry = new MountRegistry();
  readonly rootMount: ElementMount;

  readonly element = document.createElement("div");
  readonly host = document.createElement("div");
  readonly shadow = this.host.attachShadow({ mode: "open" });
}
