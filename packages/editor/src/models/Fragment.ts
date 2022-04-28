import { Component } from "./Component";
import { Element } from "./Element";
import { Text } from "./Text";
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
      type: "nodes";
      nodes: (Element | Text)[];
    };
