import { StyleJSON, VariantCondition } from "@uimix/model/src/data/v1";

export type Variants = Record<string, Partial<StyleJSON>>;

export type StyleProps = Partial<StyleJSON> & {
  variants?: Variants;
};

export interface PageNode {
  type: "page";
  children: (InstanceNode | FrameNode | LeafNode | ComponentNode)[];
}

export interface ComponentNode {
  type: "component";
  props: {
    id: string;
  };
  children: (FrameNode | VariantNode)[];
}

export interface VariantNode {
  type: "variant";
  props: {
    condition: VariantCondition;
  };
}

export interface InstanceNode {
  type: "instance";
  props: { id: string } & StyleProps;
  children: OverrideNode[];
}

export interface FrameNode {
  type: "frame";
  props: { id: string } & StyleProps;
  children: (InstanceNode | FrameNode | LeafNode)[];
}

export interface LeafNode {
  type: "text" | "svg" | "image" | "foreign";
  props: { id: string } & StyleProps;
}

export interface OverrideNode {
  type: "override";
  props: { id: string } & StyleProps;
}

export type Node =
  | PageNode
  | ComponentNode
  | VariantNode
  | InstanceNode
  | FrameNode
  | LeafNode
  | OverrideNode;

export function stringifyAsJSX(node: Node): string {
  const propText = Object.entries("props" in node ? node.props : {})
    .map(
      ([key, value]) =>
        /* typeof value === "string"
        ? `${key}=${JSON.stringify(value)}`
        :  */ `${key}={${JSON.stringify(value)}}`
    )
    .join(" ");

  if ("children" in node && node.children.length) {
    return `<${node.type} ${propText}>${node.children
      .map(stringifyAsJSX)
      .join("")}</${node.type}>`;
  } else {
    return `<${node.type} ${propText}/>`;
  }
}
