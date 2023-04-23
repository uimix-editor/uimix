import React from "react";
import ReactDOM from "react-dom/client";
import { Component, ComponentRenderer, PropType } from "@uimix/adapter-types";

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

export function reactComponent<Props>({
  path,
  name = "default",
  component,
  // eslint-disable-next-line @typescript-eslint/ban-types
  props = PropType.object<{}>({}),
}: {
  path: string;
  name?: string;
  component: React.ComponentType<Props>;
  props?: PropType.ObjectType<Partial<Props>>;
}): Component {
  return {
    framework: "react",
    // relative to the package root (closest package.json)
    path,
    name,
    props: Object.entries(props.props).map(([name, type]) => ({
      name: name,
      type: type as PropType.AbstractType<unknown>,
    })),
    createRenderer: (element: HTMLElement) =>
      new ReactRenderer(element, component),
  };
}

export * from "@uimix/adapter-types";
