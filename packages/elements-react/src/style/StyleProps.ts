interface Shadow {
  color: string;
  x: number;
  y: number;
  blur: number;
  spread: number;
}

type StackDirection = "x" | "y";
type StackAlign = "start" | "center" | "end";
type StackJustify = "start" | "center" | "end" | "spaceBetween";
type TextHorizontalAlign = "start" | "center" | "end" | "justify";
type TextVerticalAlign = "start" | "center" | "end";

interface Position {
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
}

type Size = "hug" | number | { min: number; max?: number };

type Fill = { solid: string };

export interface StyleProps {
  hidden: boolean;
  position: Position | null;
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
  color: string;
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

export const defaultStyle: StyleProps = {
  hidden: false,
  position: null,
  width: "hug",
  height: "hug",

  topLeftRadius: 0,
  topRightRadius: 0,
  bottomRightRadius: 0,
  bottomLeftRadius: 0,

  fills: [],
  border: null,
  borderTopWidth: 0,
  borderRightWidth: 0,
  borderBottomWidth: 0,
  borderLeftWidth: 0,

  opacity: 1,
  overflowHidden: false,

  shadows: [],

  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,

  // stack (auto layout)

  layout: "none",
  flexDirection: "x",
  flexAlign: "start",
  flexJustify: "start",
  gridColumnCount: null,
  gridRowCount: null,
  rowGap: 0,
  columnGap: 0,
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0,

  // text

  color: "#000000",
  textContent: "",
  fontFamily: "Inter",
  fontWeight: 400,
  fontSize: 16,
  lineHeight: null,
  letterSpacing: 0,
  textHorizontalAlign: "start",
  textVerticalAlign: "start",

  image: null,

  tagName: null,
};
