import { StyleJSON, VariantCondition } from "@uimix/model/src/data/v1";
import { HierarchicalNodeJSON } from "../project/HierarchicalNodeJSON";

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

export function toHumanReadableNode(
  json: HierarchicalNodeJSON,
  styles: Record<string, Partial<StyleJSON>>
): Node {
  const style = styles[json.id] ?? {}; // TODO: variant styles

  switch (json.type) {
    case "project":
      throw new Error("Project node is not supported in HumanReadableFormat");
    case "page":
      return {
        type: json.type,
        props: {
          id: json.id,
        },
        children: json.children.map((c) =>
          toHumanReadableNode(c, styles)
        ) as PageNode["children"],
      };
    case "component": {
      return {
        type: json.type,
        props: {
          id: json.id,
        },
        children: json.children.map((c) =>
          toHumanReadableNode(c, styles)
        ) as ComponentNode["children"],
      };
    }
    case "variant": {
      return {
        type: json.type,
        props: {
          condition: json.condition!, // TODO: skip if not present
          ...style,
        },
      };
    }
    case "text":
    case "image":
    case "svg":
    case "foreign": {
      return {
        type: json.type,
        props: {
          id: json.id,
          ...style,
        },
      };
    }
    case "frame": {
      return {
        type: json.type,
        props: {
          id: json.id,
          ...style,
        },
        children: json.children.map((c) =>
          toHumanReadableNode(c, styles)
        ) as FrameNode["children"],
      };
    }
    case "instance": {
      return {
        type: json.type,
        props: {
          id: json.id,
          ...style,
        },
        children: [
          // TODO: overrides
        ],
      };
    }
  }
}

export function stringifyAsJSX(node: Node): string {
  const propText = Object.entries(node.props)
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
