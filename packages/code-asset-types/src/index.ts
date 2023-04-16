export type PropType =
  | {
      type: "string";
    }
  | {
      type: "boolean";
    }
  | {
      type: "enum";
      values: string[];
    };

export interface Prop {
  name: string;
  type: PropType;
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

export interface ColorToken {
  type: "color";
  id: string;
  name: string;
  value: string;
}

export type DesignToken = ColorToken; // TODO: add more
