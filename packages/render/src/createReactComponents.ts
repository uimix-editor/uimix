import { ProjectJSON } from "@uimix/node-data";
import React from "react";
import { Component, Node, Project } from "./Project.js";

export function createReactComponents(
  projectJSON: ProjectJSON,
  imageURLs: Record<string, string>,
  foreignModules: Record<string, Record<string, any>>
): Map<string, React.FC<ComponentProps>> {
  const project = new Project(projectJSON);
  const assets: Assets = {
    imageURLs: new Map(Object.entries(imageURLs)),
    foreignModules: new Map(Object.entries(foreignModules)),
  };

  const reactComponents = new Map<string, React.FC<ComponentProps>>();
  for (const component of project.components.values()) {
    reactComponents.set(
      component.name,
      createReactComponent(component, assets)
    );
  }

  return reactComponents;
}

interface Assets {
  imageURLs: Map<string, string>;
  foreignModules: Map<string, Record<string, any>>;
}

type ComponentProps = JSX.IntrinsicElements["div"] & {
  overrides?: { [key: string]: ComponentProps };
};

class ComponentRenderer {
  constructor(
    component: Component,
    assets: Assets,
    propOverridesMap: Map<string, ComponentProps>
  ) {
    this.project = component.project;
    this.component = component;
    this.assets = assets;
    this.propOverridesMap = propOverridesMap;
  }

  readonly project: Project;
  readonly component: Component;
  readonly assets: Assets;
  readonly propOverridesMap = new Map<string, ComponentProps>();

  getPropOverridesForNode(node: Node) {
    if (node.id === this.component.rootNode.id) {
      return this.propOverridesMap.get("") ?? {};
    }
    const refID = this.component.refIDs.get(node.id);
    if (!refID) {
      return {};
    }
    return this.propOverridesMap.get(refID) ?? {};
  }

  render(instancePath: string[]): JSX.Element {
    return this.renderNode(this.component.rootNode, instancePath, true);
  }

  renderNode(node: Node, instancePath: string[], isRoot: boolean): JSX.Element {
    const isInstanceRoot = isRoot && instancePath.length;

    const idPath = isInstanceRoot ? instancePath : [...instancePath, node.id];
    const style = this.project.getStyle(idPath);

    const tagName = style.tagName ?? "div";

    const classNames: string[] = [];
    for (let i = 0; i < idPath.length; ++i) {
      classNames.push("uimix-" + idPath.slice(i).join("-"));
    }
    if (isInstanceRoot) {
      classNames.push("uimix-" + node.id);
    }

    const overrideProps = this.getPropOverridesForNode(node);
    const commonProps: ComponentProps = {
      className: classNames.join(" "),
      ...overrideProps,
    };
    delete commonProps.overrides;

    const hasChildrenOverride = overrideProps.children !== undefined;

    if (node.type === "text") {
      return React.createElement(
        tagName,
        { ...commonProps },
        ...(hasChildrenOverride ? [] : [style.textContent])
      );
    }
    if (node.type === "image") {
      const src = style.imageHash;
      const imageURL = src ? this.assets.imageURLs.get(src) : undefined;
      return React.createElement("img", { ...commonProps, src: imageURL });
    }
    if (node.type === "instance") {
      const mainComponentID = style.mainComponentID;
      const componentRenderer =
        mainComponentID &&
        this.component.project.components.get(mainComponentID);
      if (!componentRenderer) {
        console.error(
          `Component ${mainComponentID} not found for instance ${node.id}`
        );
        return React.createElement("div");
      }

      const { overrides, ...rootProps } = overrideProps;
      const innerOverridesMap = new Map(Object.entries(overrides ?? {}));
      innerOverridesMap.set("", rootProps);

      return new ComponentRenderer(
        componentRenderer,
        this.assets,
        innerOverridesMap
      ).render([...instancePath, node.id]);
    }
    if (node.type === "foreign") {
      const foreignComponentID = style.foreignComponentID;
      if (!foreignComponentID) {
        console.error(`Foreign component ID not found for node ${node.id}`);
        return React.createElement("div");
      }

      const foreignComponent = this.assets.foreignModules.get(
        foreignComponentID.path
      )?.[foreignComponentID.name];
      if (!foreignComponent) {
        console.error(
          `Foreign component ${foreignComponentID.path}#${foreignComponentID.name} not found for node ${node.id}`
        );
        return React.createElement("div");
      }

      return React.createElement(
        tagName,
        { ...commonProps },
        React.createElement(foreignComponent, { ...foreignComponentID.props })
      );
    }

    return React.createElement(
      tagName,
      { ...commonProps },
      ...(hasChildrenOverride
        ? []
        : node.children.map((child) =>
            this.renderNode(child, instancePath, false)
          ))
    );
  }
}

function createReactComponent(
  component: Component,
  assets: Assets
): React.FC<ComponentProps> {
  const Component = React.forwardRef((props, ref) => {
    const { overrides, ...rootOverride } = { ...props, ref };
    const propOverridesMap = new Map<string, ComponentProps>();
    for (const [refID, override] of Object.entries(overrides ?? {})) {
      propOverridesMap.set(refID, override);
    }
    propOverridesMap.set("", rootOverride);

    return new ComponentRenderer(component, assets, propOverridesMap).render(
      []
    );
  }) as React.FC<ComponentProps>;
  Component.displayName = component.name;
  return Component;
}
