import { makeObservable, observable } from "mobx";
import { ElementJSON } from "./Element";
import { RootElement } from "./RootElement";
import { Variant, VariantJSON } from "./Variant";

export class Component {
  constructor() {
    makeObservable(this);
  }

  @observable name = "my-component";

  readonly defaultVariant = new Variant(this);
  readonly variants = observable<Variant>([]);

  readonly rootElement = new RootElement(this);

  toJSON(): ComponentJSON {
    return {
      name: this.name,
      variants: this.variants.map((variant) => variant.toJSON()),
      rootElement: this.rootElement.toJSON(),
    };
  }

  loadJSON(json: ComponentJSON): void {
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
  name: string;
  variants: VariantJSON[];
  rootElement: ElementJSON;
}
