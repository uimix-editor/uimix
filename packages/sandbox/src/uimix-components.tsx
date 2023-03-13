import React from "react";
import ReactDOM from "react-dom/client";
import { Button } from "./stories/Button";
import { Header } from "./stories/Header";

// TODO: share type with ForeignComponentManager

type Type =
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

interface Prop {
  name: string;
  type: Type;
}

interface ForeignComponent {
  framework: "react"; // TODO: support other frameworks
  path: string; // path relative to project root e.g. "src/Button.tsx"
  name: string; // export name; e.g. "Button" ("default" for default export)
  props: Prop[];
  createRenderer: (element: HTMLElement) => ForeignComponentRenderer;
}

interface ForeignComponentRenderer {
  render(props: Record<string, unknown>): Promise<void>;
  dispose(): void;
}

class ReactRenderer implements ForeignComponentRenderer {
  constructor(element: HTMLElement, Component: React.ElementType) {
    this.reactRoot = ReactDOM.createRoot(element);
    this.component = Component;
  }

  render(props: Record<string, unknown>) {
    return new Promise<void>((resolve) => {
      this.reactRoot.render(
        <div style={{ display: "contents" }} ref={() => resolve()}>
          <this.component {...props} />
        </div>
      );
    });
  }

  dispose() {
    this.reactRoot.unmount();
  }

  reactRoot: ReactDOM.Root;
  component: React.ElementType;
}

export const components: ForeignComponent[] = [
  {
    framework: "react",
    path: "src/stories/Button.tsx",
    name: "Button",
    props: [
      {
        name: "primary",
        type: { type: "boolean" },
      },
      {
        name: "backgroundColor",
        type: { type: "string" },
      },
      {
        name: "size",
        type: {
          type: "enum",
          values: ["small", "medium", "large"],
        },
      },
      {
        name: "label",
        type: { type: "string" },
      },
    ],
    createRenderer: (element: HTMLElement) =>
      new ReactRenderer(element, Button),
  },
  {
    framework: "react",
    path: "src/stories/Header.tsx",
    name: "Header",
    props: [],
    createRenderer: (element: HTMLElement) =>
      new ReactRenderer(element, Header),
  },
];

export { React, ReactDOM };
