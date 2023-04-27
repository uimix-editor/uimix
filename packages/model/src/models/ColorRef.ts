import { Color } from "@uimix/foundation/src/utils/Color";
import * as Data from "../data/v1";
import { CodeColorToken, ColorToken } from "./ColorToken";
import { Project } from "./Project";

export class ColorRef {
  constructor(value: Color | ColorToken | CodeColorToken) {
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

  static fromJSON(project: Project, json: Data.Color): ColorRef | undefined {
    if (typeof json === "string") {
      const color = Color.from(json);
      return color && new ColorRef(color);
    }
    const token = project.colorTokens.get(json.token);
    return token && new ColorRef(token);
  }

  toJSON(): Data.Color {
    if (this.value.type === "color") {
      return this.value.value.toHex();
    } else {
      return {
        token: this.value.value.id,
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
        value: ColorToken | CodeColorToken;
      };
}
