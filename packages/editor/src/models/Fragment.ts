import { Component } from "./Component";
import { ElementInstance } from "./ElementInstance";
import { TextInstance } from "./TextInstance";
import { Variant } from "./Variant";

export type Fragment =
  | {
      type: "components";
      components: Component[];
    }
  | {
      type: "variants";
      variants: Variant[];
    }
  | {
      type: "instances";
      instances: (ElementInstance | TextInstance)[];
    };
