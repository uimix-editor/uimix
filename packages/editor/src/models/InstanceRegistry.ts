import { DefaultVariant, Variant } from "./Variant";

export class InstanceRegistry<TNode extends object, TInstance> {
  constructor(
    factory: (variant: Variant | DefaultVariant, node: TNode) => TInstance
  ) {
    this.factory = factory;
  }
  private readonly factory: (
    variant: Variant | DefaultVariant,
    node: TNode
  ) => TInstance;

  private instances = new WeakMap<
    Variant | DefaultVariant,
    WeakMap<TNode, TInstance>
  >();

  get(variant: Variant | DefaultVariant, element: TNode): TInstance {
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
