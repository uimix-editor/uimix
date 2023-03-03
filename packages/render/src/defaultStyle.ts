import { StyleJSON } from "@uimix/node-data";

export const defaultStyle: StyleJSON = {
  position: {
    x: {
      type: "start",
      start: 0,
    },
    y: {
      type: "start",
      start: 0,
    },
  },
  absolute: false,
  width: {
    type: "fixed",
    value: 0,
  },
  height: {
    type: "fixed",
    value: 0,
  },

  topLeftRadius: 0,
  topRightRadius: 0,
  bottomRightRadius: 0,
  bottomLeftRadius: 0,

  fill: null,
  border: null,
  borderTopWidth: 0,
  borderRightWidth: 0,
  borderBottomWidth: 0,
  borderLeftWidth: 0,

  // stack (auto layout)

  layout: "none",
  stackDirection: "x",
  stackAlign: "start",
  stackJustify: "start",
  gap: 0,
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0,

  // text

  textContent: "",
  fontFamily: "Inter",
  fontWeight: 400,
  fontSize: 16,
  lineHeight: 1.5,
  letterSpacing: 0,
  textHorizontalAlign: "start",
  textVerticalAlign: "start",

  // image

  imageHash: null,

  // instance
  mainComponentID: null,

  // foreign instance
  foreignComponentID: null,

  // element
  tagName: null,
};
