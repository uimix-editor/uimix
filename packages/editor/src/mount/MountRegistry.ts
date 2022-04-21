import { Element } from "../models/Element";
import { Text } from "../models/Text";
import { ElementMount } from "./ElementMount";
import { TextMount } from "./TextMount";
import { WeakMultiMap } from "@seanchas116/paintkit/src/util/WeakMultiMap";
import { Variant } from "../models/Variant";
import { VariantMount } from "./VariantMount";

class VariantMountRegistry {
  readonly elementMounts = new WeakMultiMap<Element, ElementMount>();
  readonly textMounts = new WeakMultiMap<Text, TextMount>();
  readonly variantMounts = new Set<VariantMount>();
}

export class MountRegistry {
  private readonly mountRegistries = new WeakMap<
    Variant,
    VariantMountRegistry
  >();

  private getVariantMountRegistry(variant: Variant): VariantMountRegistry {
    let registry = this.mountRegistries.get(variant);
    if (!registry) {
      registry = new VariantMountRegistry();
      this.mountRegistries.set(variant, registry);
    }
    return registry;
  }

  setElementMount(mount: ElementMount): void {
    this.getVariantMountRegistry(mount.variant).elementMounts.set(
      mount.element,
      mount
    );
  }

  setTextMount(mount: TextMount): void {
    this.getVariantMountRegistry(mount.variant).textMounts.set(
      mount.text,
      mount
    );
  }

  setVariantMount(mount: VariantMount): void {
    this.getVariantMountRegistry(mount.variant).variantMounts.add(mount);
  }

  deleteElementMount(mount: ElementMount): void {
    this.getVariantMountRegistry(mount.variant).elementMounts.deleteValue(
      mount.element,
      mount
    );
  }

  deleteTextMount(mount: TextMount): void {
    this.getVariantMountRegistry(mount.variant).textMounts.deleteValue(
      mount.text,
      mount
    );
  }

  deleteVariantMount(mount: VariantMount): void {
    this.getVariantMountRegistry(mount.variant).variantMounts.delete(mount);
  }
}
