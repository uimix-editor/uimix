import { ReactNode } from "react";
import { z } from "zod";

const Shadow = z.object({
  color: z.string(),
  x: z.number(),
  y: z.number(),
  blur: z.number(),
  spread: z.number(),
});

type Shadow = z.infer<typeof Shadow>;

const StackDirection = z.enum(["x", "y"]);
type StackDirection = z.infer<typeof StackDirection>;

const StackAlign = z.enum(["start", "center", "end"]);
type StackAlign = z.infer<typeof StackAlign>;

const StackJustify = z.enum(["start", "center", "end", "spaceBetween"]);
type StackJustify = z.infer<typeof StackJustify>;

const TextHorizontalAlign = z.enum(["start", "center", "end", "justify"]);
type TextHorizontalAlign = z.infer<typeof TextHorizontalAlign>;

const TextVerticalAlign = z.enum(["start", "center", "end"]);
type TextVerticalAlign = z.infer<typeof TextVerticalAlign>;

const Position = z.object({
  left: z.number().optional(),
  top: z.number().optional(),
  right: z.number().optional(),
  bottom: z.number().optional(),
});
type Position = z.infer<typeof Position>;

const Size = z.union([
  z.literal("hug"),
  z.number(),
  z.object({
    min: z.number(),
    max: z.number().optional(),
  }),
]);
type Size = z.infer<typeof Size>;

const Color = z.union([
  z.string(), // hex
  z.object({
    token: z.string(),
  }),
]);
type Color = z.infer<typeof Color>;

const Fill = z.object({
  solid: Color,
});
type Fill = z.infer<typeof Fill>;

export const Box: React.FC<
  Partial<StyleProps> & {
    children?: ReactNode;
  }
> = (props) => {
  return <div>{props.children}</div>;
};

interface StyleProps {
  hidden: boolean;
  position: Position;
  absolute: boolean;
  width: Size;
  height: Size;
  topLeftRadius: number;
  topRightRadius: number;
  bottomRightRadius: number;
  bottomLeftRadius: number;
  fills: Fill[];
  border: Fill | null;
  borderTopWidth: number;
  borderRightWidth: number;
  borderBottomWidth: number;
  borderLeftWidth: number;
  opacity: number;
  overflowHidden: boolean;
  shadows: Shadow[];

  // only for non-absolute layers
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;

  // layout
  layout: "none" | "flex" | "grid";
  flexDirection: StackDirection;
  flexAlign: StackAlign;
  flexJustify: StackJustify;
  gridRowCount: number | null;
  gridColumnCount: number | null;
  rowGap: number;
  columnGap: number;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;

  // text
  textContent: string;
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  lineHeight: number | string | null; // percent means relative to font size (null for auto)
  letterSpacing: number | string; // percent means relative to font size: ;
  textHorizontalAlign: TextHorizontalAlign;
  textVerticalAlign: TextVerticalAlign;

  // image URL
  image: string | null;

  // tag name
  tagName: string | null;
}
