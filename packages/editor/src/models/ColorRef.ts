import { Color } from "../utils/Color";
import { ColorToken } from "./ColorToken";
import { Project } from "./Project";
import { Color as ColorJSON } from "@uimix/node-data";

export class ColorRef {
  constructor(value: Color | ColorToken) {
    this.value = value;
  }

  static fromJSON(project: Project, json: ColorJSON): ColorRef | undefined {
    if (typeof json === "string") {
      const color = Color.from(json);
      return color && new ColorRef(color);
    }
    const token = project.colorTokens.get(json.id);
    return token && new ColorRef(token);
  }

  toJSON(): ColorJSON {
    if (this.value instanceof Color) {
      return this.value.toHex();
    } else {
      return {
        type: "token",
        id: this.value.id,
      };
    }
  }

  get color(): Color {
    if (this.value instanceof Color) {
      return this.value;
    } else {
      return this.value.value ?? Color.black;
    }
  }

  readonly value: Color | ColorToken;
}
