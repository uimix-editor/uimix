import * as PropType from "./props";

export { PropType };

export interface Prop {
  name: string;
  type:
    | PropType.StringType
    | PropType.BooleanType
    | PropType.EnumType<string[]>;
}

export interface Component {
  framework: "react"; // TODO: support other frameworks
  path: string; // path relative to project root e.g. "src/Button.tsx"
  name: string; // export name; e.g. "Button" ("default" for default export)
  props: Prop[];
  createRenderer: (element: HTMLElement) => ComponentRenderer;
}

export interface ComponentRenderer {
  render(props: Record<string, unknown>): Promise<void>;
  dispose(): void;
}

// W3C design tokens https://design-tokens.github.io/community-group/format

export interface ColorToken {
  $value: string;
  $type: "color";
}

export type DesignToken = ColorToken;

export interface DesignTokens {
  [key: string]: DesignToken | DesignTokens;
}
