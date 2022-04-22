import { makeObservable, observable } from "mobx";
import shortUUID from "short-uuid";
import { ElementJSON } from "./Element";
import { RootElement } from "./RootElement";
import { Variant, VariantJSON } from "./Variant";

export class Component {
  constructor(key?: string) {
    this.key = key ?? shortUUID.generate();
    makeObservable(this);
  }

  readonly key: string;

  @observable name = "my-component";

  readonly rootElement = new RootElement(this);

  readonly defaultVariant = new Variant(this);
  readonly variants = observable<Variant>([]);
  get allVariants(): Variant[] {
    return [this.defaultVariant, ...this.variants];
  }

  @observable selected = false;

  select(): void {
    this.selected = true;
    for (const variant of this.allVariants) {
      variant.rootInstance.select();
    }
  }

  deselect(): void {
    this.selected = false;
    for (const variant of this.allVariants) {
      variant.rootInstance.deselect();
    }
  }

  @observable collapsed = true;

  toJSON(): ComponentJSON {
    return {
      key: this.key,
      name: this.name,
      variants: this.variants.map((variant) => variant.toJSON()),
      rootElement: this.rootElement.toJSON(),
    };
  }

  loadJSON(json: ComponentJSON): void {
    if (json.key !== this.key) {
      throw new Error("Component key mismatch");
    }

    this.name = json.name;

    const oldVariants = new Map<string, Variant>();
    for (const variant of this.variants) {
      oldVariants.set(variant.key, variant);
    }

    this.variants.clear();
    for (const variantJSON of json.variants) {
      const variant =
        oldVariants.get(variantJSON.key) || new Variant(this, variantJSON.key);
      variant.loadJSON(variantJSON);
      this.variants.push(variant);
    }

    this.rootElement.loadJSON(json.rootElement);
  }
}

export interface ComponentJSON {
  key: string;
  name: string;
  variants: VariantJSON[];
  rootElement: ElementJSON;
}
