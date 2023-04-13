import { StyleJSON, VariantCondition } from "@uimix/model/src/data/v1";

type Variants = Record<string, Partial<StyleJSON>>;

type StyleProps = Partial<StyleJSON> & {
  variants?: Variants;
};

interface PageNode {
  type: "node";
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
