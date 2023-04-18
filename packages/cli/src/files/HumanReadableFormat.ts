import {
  PositionConstraint,
  Shadow,
  SizeConstraint,
  SolidFill,
  StackAlign,
  StackDirection,
  StackJustify,
  TextHorizontalAlign,
  TextVerticalAlign,
  VariantCondition,
} from "@uimix/model/src/data/v1";
import { z } from "zod";

export const BaseStyleProps = z.object({
  hidden: z.boolean(),
  locked: z.boolean(),
  position: z.tuple([PositionConstraint, PositionConstraint]),
  absolute: z.boolean(),
  width: SizeConstraint,
  height: SizeConstraint,

  topLeftRadius: z.number(),
  topRightRadius: z.number(),
  bottomRightRadius: z.number(),
  bottomLeftRadius: z.number(),

  fills: z.array(SolidFill),
  border: z.union([SolidFill, z.null()]),
  borderTopWidth: z.number(),
  borderRightWidth: z.number(),
  borderBottomWidth: z.number(),
  borderLeftWidth: z.number(),

  opacity: z.number(),
  overflowHidden: z.boolean(),

  shadows: z.array(Shadow),

  // only for non-absolute layers
  marginTop: z.number(),
  marginRight: z.number(),
  marginBottom: z.number(),
  marginLeft: z.number(),

  // layout

  layout: z.enum(["none", "flex", "grid"]),
  flexDirection: StackDirection,
  flexAlign: StackAlign,
  flexJustify: StackJustify,
  gridRowCount: z.union([z.number(), z.null()]),
  gridColumnCount: z.union([z.number(), z.null()]),
  rowGap: z.number(),
  columnGap: z.number(),
  paddingTop: z.number(),
  paddingRight: z.number(),
  paddingBottom: z.number(),
  paddingLeft: z.number(),

  // text

  textContent: z.string(),
  fontFamily: z.string(),
  fontWeight: z.number(),
  fontSize: z.number(),
  lineHeight: z.union([z.number(), z.string(), z.null()]), // percent means relative to font size (null for auto)
  letterSpacing: z.union([z.number(), z.string()]), // percent means relative to font size: ;
  textHorizontalAlign: TextHorizontalAlign,
  textVerticalAlign: TextVerticalAlign,

  // image
  image: z.union([z.string(), z.null()]),

  // svg
  svg: z.string(),

  // instance
  component: z.union([z.string(), z.null()]),

  // foreign
  componentType: z.literal("react"),
  props: z.record(z.unknown()),

  // tag name
  tagName: z.union([z.string(), z.null()]),
});
export type BaseStyleProps = z.infer<typeof BaseStyleProps>;

export interface StyleProps extends Partial<BaseStyleProps> {
  variants?: Record<string, StyleProps>;
  overrides?: Record<string, StyleProps>;
}

export interface PageNode {
  type: "page";
  children: (SceneNode | ComponentNode | ColorTokenNode)[];
}

export interface ComponentNode {
  type: "component";
  props: {
    id: string;
  };
  children: (SceneNode | VariantNode)[];
}

export interface VariantNode {
  type: "variant";
  props: {
    condition: VariantCondition;
  };
}

export interface SceneNode {
  type: "frame" | "instance" | "text" | "svg" | "image" | "foreign";
  props: { id: string } & StyleProps;
  children: SceneNode[];
}

export interface ColorTokenNode {
  type: "colorToken";
  props: {
    id: string;
    value: string;
    name: string;
  };
}

export type Node =
  | PageNode
  | ComponentNode
  | VariantNode
  | SceneNode
  | ColorTokenNode;

export function stringifyAsJSX(node: Node): string {
  const propText = Object.entries("props" in node ? node.props : {})
    .map(([key, value]) => {
      if (value === undefined) {
        return "";
      }
      if (typeof value === "string" && !value.includes("//")) {
        return `${key}=${JSON.stringify(value)}`;
      }
      return `${key}={${JSON.stringify(value)}}`;
    })
    .join(" ");

  if ("children" in node && node.children.length) {
    return `<${node.type} ${propText}>${node.children
      .map(stringifyAsJSX)
      .join("")}</${node.type}>`;
  } else {
    return `<${node.type} ${propText}/>`;
  }
}
