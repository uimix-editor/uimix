import React from "react";
import ReactDOM from "react-dom/client";
import { Button } from "./stories/Button";
import { Header } from "./stories/Header";
import type {
  ForeignComponent,
  ForeignComponentRenderer,
} from "../../editor/src/types/ForeignComponent";

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
