import { Color } from "@uimix/foundation/src/utils/Color";
import { Color as ColorJSON } from "../data/v1";
import { ColorToken } from "./ColorToken";
import { Project } from "./Project";

export class ColorRef {
  constructor(value: Color | ColorToken) {
    if (value instanceof Color) {
      this.value = {
        type: "color",
        value,
      };
    } else {
      this.value = {
        type: "token",
        value,
      };
    }
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
    if (this.value.type === "color") {
      return this.value.value.toHex();
    } else {
      return {
        type: "token",
        id: this.value.value.id,
      };
    }
  }

  get color(): Color {
    if (this.value.type === "color") {
      return this.value.value;
    } else {
      return this.value.value.value ?? Color.black;
    }
  }

  readonly value:
    | {
        type: "color";
        value: Color;
      }
    | {
        type: "token";
        value: ColorToken;
      };
}
