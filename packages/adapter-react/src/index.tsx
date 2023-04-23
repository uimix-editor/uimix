import React from "react";
import ReactDOM from "react-dom/client";
import {
  Component,
  ComponentRenderer,
  Prop,
  PropType,
} from "@uimix/adapter-types";

export class ReactRenderer implements ComponentRenderer {
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

export function reactComponent<Props>(options: {
  path: string;
  name?: string;
  component: React.ComponentType<Props>;
  props: PropType.ObjectType<Partial<Props>>;
}): Component {
  return {
    framework: "react",
    // relative to the package root (closest package.json)
    path: options.path,
    name: options.name ?? "default",
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
      new ReactRenderer(element, options.component),
  };
}

export * from "@uimix/adapter-types";
