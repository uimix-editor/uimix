import { camelCase, compact } from "lodash-es";
import { posix as path } from "path";
import htmlReactParser from "html-react-parser";
import reactElementToJSXString from "react-element-to-jsx-string";
import React from "react";
import {
  IncrementalUniqueNameGenerator,
  generateJSIdentifier,
  getIncrementalUniqueName,
} from "@uimix/foundation/src/utils/Name";
import { Component, Selectable, Page } from "@uimix/model/src/models";
import { ClassNameGenerator } from "./ClassNameGenerator";
import { ProjectManifest } from "@uimix/model/src/file";

// TODO: remove this when react-element-to-jsx-string is fixed
const reactElementToJSXStringFixed =
  typeof reactElementToJSXString === "function"
    ? reactElementToJSXString
    : (
        reactElementToJSXString as {
          default: typeof reactElementToJSXString;
        }
      ).default;

const applyOverridesSnippet = `
function applyOverrides(
  rootProps: any,
  element: React.ReactElement
): React.ReactElement {
  const { "data-refID": refID, ...props } = element.props;

  let additionalProps: any = rootProps;
  for (const id of refID ?? []) {
    additionalProps = additionalProps[id + "Props"] ?? {};
  }
  additionalProps = { ...additionalProps };
  for (const key of Object.keys(additionalProps)) {
    if (key.endsWith("Props")) {
      delete additionalProps[key];
    }
  }

  const result = React.cloneElement(
    { ...element, props, },
    {
      ...additionalProps,
      className: additionalProps.className ? props.className + " " + additionalProps.className : props.className,
      children:
        additionalProps.children ??
        React.Children.map(element.props.children, (child) => {
          if (React.isValidElement(child)) {
            return applyOverrides(rootProps, child);
          } else {
            return child;
          }
        }),
    }
  );
  return result;
}
`;

function imageHashToVarName(hash: string): string {
  return "image__" + hash.replaceAll("-", "$");
}

function getExternalModulePaths(components: Component[]): Set<string> {
  const externalModules = new Set<string>();

  for (const component of components) {
    const visitSelectable = (selectable: Selectable) => {
      const foreignComponentID = selectable.selfStyle.foreignComponent;
      if (foreignComponentID) {
        externalModules.add(foreignComponentID.path);
      }
      for (const child of selectable.children) {
        visitSelectable(child);
      }
    };
    visitSelectable(component.rootNode.selectable);
  }

  return externalModules;
}

export class ReactGenerator {
  constructor(options: {
    rootPath: string;
    manifest: ProjectManifest;
    page: Page;
    imagePaths: Map<string, string>;
    classNameGenerator: ClassNameGenerator;
  }) {
    this.rootPath = options.rootPath;
    this.manifest = options.manifest;
    this.page = options.page;
    this.imagePaths = options.imagePaths;
    this.classNameGenerator = options.classNameGenerator;

    const componentNames = new Set<string>();
    for (const component of this.page.components) {
      const name = getIncrementalUniqueName(
        componentNames,
        generateJSIdentifier(component.name ?? "")
      );
      componentNames.add(name);
      this.componentsWithNames.push([component, name]);
    }
  }

  rootPath: string;
  manifest: ProjectManifest;
  page: Page;
  imagePaths: Map<string, string>;
  classNameGenerator: ClassNameGenerator;
  componentsWithNames: [Component, string][] = [];
  refIDs = new Map<string, string>();
  moduleVarNames = new Map<string, string>(); // path -> varName
  imageVarNames = new Map<string, string>(); // hash -> varName

  render(): string[] {
    const components = this.page.components;

    const results: string[] = [];
    results.push(`import React from "react";`);

    const pathToRoot = path.relative(
      path.dirname(this.page.filePath),
      this.rootPath
    );

    const namer = new IncrementalUniqueNameGenerator();

    for (const modulePath of getExternalModulePaths(components)) {
      const varName = namer.generateLowerJSIdentifier(
        "external__" + path.basename(modulePath, path.extname(modulePath))
      );

      const importPath = modulePath.startsWith("/")
        ? path.join(pathToRoot, modulePath.slice(1).replace(/\.[jt]sx?$/, ""))
        : modulePath;

      results.push(`import * as ${varName} from "${importPath}";`);
      this.moduleVarNames.set(modulePath, varName);
    }

    for (const [hash, imagePathFromRoot] of this.imagePaths) {
      let imagePathFromPage = path.relative(
        path.dirname(this.page.filePath),
        imagePathFromRoot
      );
      if (!imagePathFromPage.startsWith(".")) {
        imagePathFromPage = "./" + imagePathFromPage;
      }

      const varName = imageHashToVarName(hash);
      results.push(`import ${varName} from "${imagePathFromPage}";`);
      this.imageVarNames.set(hash, varName);
    }

    // TODO: import needed CSS files only
    for (const page of this.page.project.pages.all) {
      const basename = path.basename(page.filePath);
      results.push(`import './${basename}.uimix.css';`);
    }

    results.push(applyOverridesSnippet);

    for (const component of components) {
      for (const [id, refID] of component.refIDs) {
        this.refIDs.set(id, refID);
      }
    }

    for (const [component, name] of this.componentsWithNames) {
      // TODO: non-conflicting component name

      const refIDs = component.refIDs;

      const node = this.renderSelectable(component.rootNode.selectable);

      const overrideProps = [...refIDs].map(([id, refID]) => {
        const node = this.page.project.nodes.get(id);
        const selectable = node?.selectable;
        const foreignComponentID = selectable?.style.foreignComponent;
        const tagName = selectable?.style.tagName ?? "div";
        if (node?.type === "foreign" && foreignComponentID) {
          const exportName = foreignComponentID.name;
          const moduleName = this.moduleVarNames.get(foreignComponentID.path);
          if (moduleName) {
            return `"${refID}Props"?: Partial<React.ComponentProps<typeof ${moduleName}.${exportName}>>`;
          }
        }

        return `"${refID}Props"?: JSX.IntrinsicElements["${tagName}"];`;
      });

      const typeText = [
        `React.FC<JSX.IntrinsicElements["div"] & {`,
        ...overrideProps,
        `}>`,
      ];

      results.push(
        `export const ${name} = React.forwardRef((props, ref) => {`,
        `return applyOverrides({...props, ref}, `,
        ...node,
        `)`,
        `}) as`,
        ...typeText,
        ""
      );
    }

    return results;
  }

  renderSelectable(selectable: Selectable): string[] {
    const { style, idPath, node } = selectable;

    const classNames: string[] = [];
    for (let i = 0; i < idPath.length; ++i) {
      classNames.push(this.classNameGenerator.get(idPath.slice(i)));
    }

    if (
      selectable.idPath.length === 1 &&
      selectable.originalNode.type === "instance"
    ) {
      const mainComponent = selectable.mainComponent;
      if (mainComponent) {
        classNames.push(
          this.classNameGenerator.get([mainComponent.rootNode.id])
        );
      }
    }

    const className = classNames.join(" ");

    const refIDPath = compact(idPath.map((id) => this.refIDs.get(id)));

    const props = {
      className,
      ...(refIDPath.length ? { "data-refID": refIDPath } : {}),
    };

    const propTexts = Object.entries(props).map(
      ([key, value]) => `${key}={${JSON.stringify(value)}} `
    );

    if (node.type === "text") {
      const tagName = style.tagName ?? "div";

      return [
        `<${tagName}`,
        ...propTexts,
        `>{`,
        JSON.stringify(style.textContent),
        `}</${tagName}>`,
      ];
    }
    if (node.type === "image") {
      const src = this.imageVarNames.get(style.imageHash ?? "") ?? "";
      return [
        `<img`,
        ...propTexts,
        `src={${src}} alt=${JSON.stringify(node.name)}/>`,
      ];
    }
    if (node.type === "svg") {
      const svg = style.svgContent.trim();
      const svgElement = svg ? htmlReactParser(svg) : undefined;

      if (!React.isValidElement(svgElement)) {
        console.warn("invalid svg", svg);
        return [];
      }
      const changedElement = React.cloneElement(svgElement, {
        ...props,
      });
      return [reactElementToJSXStringFixed(changedElement)];
    }

    if (node.type === "foreign") {
      const foreignComponentID = style.foreignComponent;
      if (!foreignComponentID) {
        return [];
      }
      const moduleName = this.moduleVarNames.get(foreignComponentID.path);
      if (!moduleName) {
        return [];
      }
      return [
        `<${moduleName}.${foreignComponentID.name}`,
        ...propTexts,
        `{...${JSON.stringify(foreignComponentID.props)}} />`,
      ];
    }
    if (node.type === "frame") {
      const children = selectable.children.flatMap((child) =>
        this.renderSelectable(child)
      );

      const tagName = style.tagName ?? "div";

      return [`<${tagName}`, ...propTexts, `>`, ...children, `</${tagName}>`];
    }

    return [];
  }
}
