import { StyleJSON, VariantCondition } from "@uimix/model/src/data/v1";
import { HierarchicalNodeJSON } from "./HierarchicalNodeJSON";

type Variants = Record<string, Partial<StyleJSON>>;

type StyleProps = Partial<StyleJSON> & {
  variants?: Variants;
};

interface PageNode {
  type: "page";
  id: string;
  children: (InstanceNode | FrameNode | LeafNode | ComponentNode)[];
}

interface ComponentNode {
  type: "component";
  id: string;
  children: (FrameNode | VariantNode)[];
}

interface VariantNode {
  type: "variant";
  props: StyleProps & {
    condition: VariantCondition;
  };
}

interface InstanceNode {
  type: "instance";
  id: string;
  props: StyleProps;
  children: OverrideNode[];
}

interface FrameNode {
  type: "frame";
  id: string;
  props: StyleProps;
  children: (InstanceNode | FrameNode | LeafNode)[];
}

interface LeafNode {
  type: "text" | "svg" | "image" | "foreign";
  id: string;
  props: StyleProps;
}

interface OverrideNode {
  type: "override";
  id: string;
  props: StyleProps;
}

type Node =
  | PageNode
  | ComponentNode
  | VariantNode
  | InstanceNode
  | FrameNode
  | LeafNode
  | OverrideNode;

export function toHumanReadableNode(json: HierarchicalNodeJSON): Node {
  switch (json.type) {
    case "project":
      throw new Error("Project node is not supported in HumanReadableFormat");
    case "page":
      return {
        type: json.type,
        id: json.id,
        children: json.children.map(
          toHumanReadableNode
        ) as PageNode["children"],
      };
    case "component": {
      return {
        type: json.type,
        id: json.id,
        children: json.children.map(
          toHumanReadableNode
        ) as ComponentNode["children"],
      };
    }
    case "variant": {
      return {
        type: json.type,
        props: {
          condition: json.condition!, // TODO: skip if not present
          // TODO: styles
        },
      };
    }
    case "text":
    case "image":
    case "svg":
    case "foreign": {
      return {
        type: json.type,
        id: json.id,
        props: {
          // TODO: styles
        },
      };
    }
    case "frame": {
      return {
        type: json.type,
        id: json.id,
        props: {
          // TODO: styles
        },
        children: json.children.map(
          toHumanReadableNode
        ) as FrameNode["children"],
      };
    }
    case "instance": {
      return {
        type: json.type,
        id: json.id,
        props: {
          // TODO: styles
        },
        children: [
          // TODO: overrides
        ],
      };
    }
  }
}
