import { DefaultVariant, Variant } from "./Variant";

export class InstanceRegistry<TNode extends object, TInstance> {
  constructor(
    factory: (variant: Variant | undefined, node: TNode) => TInstance
  ) {
    this.factory = factory;
  }
  private readonly factory: (
    variant: Variant | undefined,
    node: TNode
  ) => TInstance;

  private instances = new WeakMap<
    Variant | DefaultVariant,
    WeakMap<TNode, TInstance>
  >();
  private defaultInstances = new WeakMap<TNode, TInstance>();

  get(
    variant: Variant | DefaultVariant | undefined,
    element: TNode
  ): TInstance {
    if (!variant || variant.type === "defaultVariant") {
      let instance = this.defaultInstances.get(element);
      if (!instance) {
        instance = this.factory(undefined, element);
        this.defaultInstances.set(element, instance);
      }
      return instance;
    }

    let instances = this.instances.get(variant);
    if (!instances) {
      instances = new WeakMap();
      this.instances.set(variant, instances);
    }
    let instance = instances.get(element);
    if (!instance) {
      instance = this.factory(variant, element);
      instances.set(element, instance);
    }
    return instance;
  }
}
