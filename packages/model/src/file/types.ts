import {
  Fill,
  Position,
  PercentString,
  Shadow,
  Size,
  StackAlign,
  StackDirection,
  StackJustify,
  TextHorizontalAlign,
  TextVerticalAlign,
  VariantCondition,
} from "../data/v1";
import { z } from "zod";
import Babel from "@babel/standalone";

export const BaseStyleProps = z.object({
  hidden: z.boolean(),
  locked: z.boolean(),
  position: z.union([z.null(), Position]),
  preferAbsolute: z.boolean(),
  width: Size,
  height: Size,

  topLeftRadius: z.number(),
  topRightRadius: z.number(),
  bottomRightRadius: z.number(),
  bottomLeftRadius: z.number(),

  fills: z.array(Fill),
  border: z.union([Fill, z.null()]),
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
  lineHeight: z.union([z.number(), PercentString, z.null()]), // percent means relative to font size (null for auto)
  letterSpacing: z.union([z.number(), PercentString]), // percent means relative to font size
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
export const StyleProps: z.ZodType<StyleProps> =
  BaseStyleProps.partial().extend({
    variants: z.lazy(() => z.record(StyleProps)).optional(),
    overrides: z.lazy(() => z.record(StyleProps)).optional(),
  });

const SceneNodeBase = z.object({
  type: z.enum(["frame", "instance", "text", "svg", "image", "foreign"]),
  props: z.intersection(
    z.object({
      id: z.string().optional(),
      name: z.string().optional(),
    }),
    StyleProps
  ),
});
type SceneNodeBase = z.infer<typeof SceneNodeBase>;

export const SceneNode: z.ZodType<SceneNode> = SceneNodeBase.extend({
  children: z.lazy(() => z.array(SceneNode)),
});
export interface SceneNode extends SceneNodeBase {
  children: SceneNode[];
}

export const VariantNode = z.object({
  type: z.literal("variant"),
  props: z.object({
    condition: VariantCondition,
  }),
});
export type VariantNode = z.infer<typeof VariantNode>;

export const ComponentNode = z.object({
  type: z.literal("component"),
  props: z.object({
    id: z.string(),
    name: z.string(),
  }),
  children: z.array(z.union([SceneNode, VariantNode])),
});
export type ComponentNode = z.infer<typeof ComponentNode>;

export const ColorTokenNode = z.object({
  type: z.literal("colorToken"),
  props: z.object({
    id: z.string(),
    name: z.string(),
    value: z.string(),
  }),
});
export type ColorTokenNode = z.infer<typeof ColorTokenNode>;

export const PageNode = z.object({
  type: z.literal("page"),
  children: z.array(z.union([SceneNode, ComponentNode, ColorTokenNode])),
});
export type PageNode = z.infer<typeof PageNode>;

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
      if (
        typeof value === "string" &&
        !value.includes("//") &&
        !value.includes("\n")
      ) {
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

export function stringifyAsJSXFile(node: PageNode): string {
  return `export default ${stringifyAsJSX(node)};`;
}

export function loadFromJSXFile(text: string): PageNode {
  // blank
  if (/^\s*$/.test(text)) {
    return {
      type: "page",
      children: [],
    };
  }

  // use babel to transform jsx to js
  // evaluate the js to get the node

  const transformedJS = Babel.transform(text, {
    presets: [
      [
        "react",
        {
          runtime: "classic",
          throwIfNamespace: false,
        },
      ],
    ],
    plugins: ["transform-modules-commonjs"],
  }).code;
  if (!transformedJS) {
    throw new Error("Failed to transform JSX");
  }

  const jsxFactory = (
    type: string,
    props: Record<string, unknown>,
    ...children: unknown[]
  ) => ({
    type,
    props: props || {},
    children,
  });

  const exports: Record<string, unknown> = {};

  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  new Function("exports", "React", transformedJS)(exports, {
    createElement: jsxFactory,
  });
  return PageNode.parse(exports.default);
}

export const ProjectManifest = z.object({
  prebuiltAssets: z.array(z.string()).optional(),
  assets: z.string().optional(),
});
export type ProjectManifest = z.infer<typeof ProjectManifest>;
