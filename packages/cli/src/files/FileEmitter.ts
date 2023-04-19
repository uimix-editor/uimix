// import * as HumanReadable from "./HumanReadableFormat";
// import { compact } from "lodash-es";
// import {
//   Color,
//   ColorToken,
//   ProjectJSON,
//   SolidFill,
//   StyleJSON,
// } from "@uimix/model/src/data/v1";
// import {
//   generateLowerJSIdentifier,
//   generateRefIDs,
//   generateUpperJSIdentifier,
//   getIncrementalUniqueName,
// } from "@uimix/foundation/src/utils/Name";
// import { posix as path } from "path-browserify";
// import {
//   HierarchicalNodeJSON,
//   toHierarchicalNodeJSONRecord,
// } from "../project/HierarchicalNodeJSON";
// import { assertNonNull } from "@uimix/foundation/src/utils/Assert";
// import { variantConditionToText, filterUndefined, Variant } from "./util";

// export class ProjectFileEmitter {
//   constructor(projectJSON: ProjectJSON) {
//     this.projectJSON = projectJSON;
//     this.nodes = toHierarchicalNodeJSONRecord(projectJSON.nodes);

//     for (const page of this.nodes["project"].children) {
//       const componentNames = new Set<string>();

//       for (const item of page.children) {
//         if (item.type === "component") {
//           const name = getIncrementalUniqueName(
//             componentNames,
//             generateUpperJSIdentifier(item.name ?? "")
//           );
//           this.readableIDs.set(item.id, name);

//           // component element names
//           const refIDs = generateRefIDs(item.children[0]);
//           for (const [id, refID] of refIDs) {
//             this.readableIDs.set(id, refID);
//           }
//         }
//       }
//     }
//   }

//   projectJSON: ProjectJSON;
//   nodes: Record<string, HierarchicalNodeJSON>;
//   readableIDs = new Map<string, string>();

//   emit(): Map<string, HumanReadable.PageNode> {
//     const project = this.nodes["project"];

//     const colorsForPage = new Map<string, ColorToken[]>();
//     for (const color of Object.values(this.projectJSON.colors)) {
//       if (!color.page) {
//         continue;
//       }

//       let colors = colorsForPage.get(color.page);
//       if (!colors) {
//         colors = [];
//         colorsForPage.set(color.page, colors);
//       }
//       colors.push(color);
//     }

//     const result = new Map<string, HumanReadable.PageNode>();
//     for (const page of project.children) {
//       const pageEmitter = new PageFileEmitter(
//         this,
//         page,
//         colorsForPage.get(page.id) ?? []
//       );
//       const pageNode = pageEmitter.emit();
//       const pagePath = page.name ?? "";
//       result.set(pagePath, pageNode);
//     }
//     return result;
//   }
// }

// export class PageFileEmitter {
//   constructor(
//     projectEmitter: ProjectFileEmitter,
//     page: HierarchicalNodeJSON,
//     colors: ColorToken[]
//   ) {
//     this.projectEmitter = projectEmitter;
//     this.page = page;
//     this.colors = colors;
//   }

//   projectEmitter: ProjectFileEmitter;
//   page: HierarchicalNodeJSON;
//   colors: ColorToken[];

//   get nodes() {
//     return this.projectEmitter.nodes;
//   }
//   get styles() {
//     return this.projectEmitter.projectJSON.styles;
//   }
//   get readableIDs() {
//     return this.projectEmitter.readableIDs;
//   }
//   get colorTokens() {
//     return this.projectEmitter.projectJSON.colors;
//   }

//   emit(): HumanReadable.PageNode {
//     const children: (
//       | HumanReadable.SceneNode
//       | HumanReadable.ComponentNode
//       | HumanReadable.ColorTokenNode
//     )[] = [];

//     for (const child of this.page.children) {
//       if (child.type === "component") {
//         children.push(new ComponentEmitter(this, child).emit());
//       } else {
//         children.push(this.emitNode(child, []));
//       }
//     }

//     for (const color of this.colors) {
//       children.push({
//         type: "colorToken" as const,
//         props: {
//           // TODO: avoid name collision inside page
//           id: generateLowerJSIdentifier(color.name ?? ""),
//           name: color.name ?? "",
//           value: color.value?.toString() ?? "",
//         },
//       });
//     }

//     return {
//       type: "page",
//       children,
//     };
//   }

//   emitNode(
//     node: HierarchicalNodeJSON,
//     variants: Variant[]
//   ): HumanReadable.SceneNode {
//     return {
//       type: node.type as HumanReadable.SceneNode["type"],
//       props: {
//         id: this.readableIDs.get(node.id) ?? "",
//         ...this.getStyleForSelectable(node),
//         variants: Object.fromEntries(
//           variants.map((variant) => {
//             return [
//               variantConditionToText(variant.condition),
//               this.getStyleForSelectable(node, variant.id),
//             ];
//           })
//         ),
//       },
//       children: node.children.map((child) => this.emitNode(child, variants)),
//     };
//   }

//   getStyleForSelectable(
//     node: HierarchicalNodeJSON,
//     variant?: string
//   ): HumanReadable.StyleProps {
//     const getInstanceOverrides = (
//       instancePath: string[]
//     ): Record<string, HumanReadable.StyleProps> => {
//       const mainComponentID =
//         this.styles[instancePath[instancePath.length - 1]]?.mainComponent;
//       if (!mainComponentID) {
//         return {};
//       }
//       const mainComponent = this.nodes[mainComponentID];
//       if (!mainComponent) {
//         return {};
//       }

//       const overrides: Record<string, HumanReadable.StyleProps> = {};

//       const visit = (node: HierarchicalNodeJSON) => {
//         const refID = this.readableIDs.get(node.id) ?? "";
//         const idPath = [...instancePath, node.id];

//         const styleJSON = this.styles[idPath.join(":")] ?? {};

//         if (refID) {
//           overrides[refID] = this.toHumanReadableStyle(styleJSON);
//         }

//         if (node.type === "instance") {
//           overrides[refID]["overrides"] = getInstanceOverrides(idPath);
//         } else {
//           node.children.forEach((child) => visit(child));
//         }
//       };

//       mainComponent.children[0].children.forEach(visit);

//       return overrides;
//     };

//     const idPath = variant
//       ? node.parent && this.nodes[node.parent].type === "component"
//         ? [variant] // root variant
//         : [variant, node.id] // variant content
//       : [node.id];

//     return {
//       ...this.toHumanReadableStyle(this.styles[idPath.join(":")] ?? {}),
//       ...(node.type === "instance"
//         ? {
//             overrides: getInstanceOverrides(idPath),
//           }
//         : {}),
//     };
//   }

//   relativePathFromPage(filePath: string): string {
//     const pagePath = assertNonNull(this.page.name);
//     const relativePath = path.relative(path.dirname(pagePath), filePath);
//     if (!relativePath.startsWith(".")) {
//       return "./" + relativePath;
//     }
//     return relativePath;
//   }

//   pathForExport(pageID: string, name: string) {
//     const pageNode = this.nodes[pageID];
//     return this.relativePathFromPage(
//       assertNonNull(pageNode.name) + ".uimix#" + name
//     );
//   }

//   transformColor(color: Color): Color {
//     if (typeof color === "object") {
//       const token = this.colorTokens[color.id];
//       if (token && token.page) {
//         return {
//           type: "token",
//           id: this.pathForExport(
//             token.page,
//             generateLowerJSIdentifier(token.name ?? "")
//           ),
//         };
//       }
//     }
//     return color;
//   }

//   transformFill(fill: SolidFill): SolidFill {
//     return {
//       type: "solid",
//       color: this.transformColor(fill.color),
//     };
//   }

//   toHumanReadableStyle(
//     style: Partial<StyleJSON>
//   ): Partial<HumanReadable.BaseStyleProps> {
//     const mainComponent =
//       style.mainComponent != null ? this.nodes[style.mainComponent] : undefined;

//     const mainComponentPath =
//       mainComponent?.parent &&
//       this.pathForExport(mainComponent.parent, mainComponent.name!);

//     return filterUndefined<Partial<HumanReadable.BaseStyleProps>>({
//       hidden: style.hidden,
//       locked: style.locked,
//       position: style.position && [style.position.x, style.position.y],
//       absolute: style.absolute,
//       width: style.width,
//       height: style.height,

//       topLeftRadius: style.topLeftRadius,
//       topRightRadius: style.topRightRadius,
//       bottomRightRadius: style.bottomRightRadius,
//       bottomLeftRadius: style.bottomLeftRadius,

//       fills: style.fills?.map((fill) => this.transformFill(fill)),
//       border: style.border && this.transformFill(style.border),
//       borderTopWidth: style.borderTopWidth,
//       borderRightWidth: style.borderRightWidth,
//       borderBottomWidth: style.borderBottomWidth,
//       borderLeftWidth: style.borderLeftWidth,

//       opacity: style.opacity,
//       overflowHidden: style.overflowHidden,

//       shadows: style.shadows,

//       marginTop: style.marginTop,
//       marginRight: style.marginRight,
//       marginBottom: style.marginBottom,
//       marginLeft: style.marginLeft,

//       layout: style.layout,
//       flexDirection: style.flexDirection,
//       flexAlign: style.flexAlign,
//       flexJustify: style.flexJustify,
//       gridRowCount: style.gridRowCount,
//       gridColumnCount: style.gridColumnCount,
//       rowGap: style.rowGap,
//       columnGap: style.columnGap,
//       paddingTop: style.paddingTop,
//       paddingRight: style.paddingRight,
//       paddingBottom: style.paddingBottom,
//       paddingLeft: style.paddingLeft,

//       textContent: style.textContent,
//       fontFamily: style.fontFamily,
//       fontWeight: style.fontWeight,
//       fontSize: style.fontSize,
//       lineHeight:
//         style.lineHeight && typeof style.lineHeight === "object"
//           ? style.lineHeight.join("")
//           : style.lineHeight,
//       letterSpacing:
//         style.letterSpacing && typeof style.letterSpacing === "object"
//           ? style.letterSpacing.join("")
//           : style.letterSpacing,
//       textHorizontalAlign: style.textHorizontalAlign,
//       textVerticalAlign: style.textVerticalAlign,

//       image:
//         style.imageHash &&
//         this.relativePathFromPage("src/images/" + style.imageHash + ".png"),

//       svg: style.svgContent,

//       component: style.foreignComponent
//         ? `${this.relativePathFromPage(style.foreignComponent.path)}#${
//             style.foreignComponent.name
//           }`
//         : mainComponentPath,
//       componentType: style.foreignComponent?.type,
//       props: style.foreignComponent?.props,

//       tagName: style.tagName,
//     });
//   }
// }

// export class ComponentEmitter {
//   constructor(pageEmitter: PageFileEmitter, component: HierarchicalNodeJSON) {
//     this.pageEmitter = pageEmitter;
//     this.component = component;

//     this.variants = [];
//     for (const child of component.children) {
//       if (child.type === "variant" && child.condition) {
//         this.variants.push({
//           id: child.id,
//           condition: child.condition,
//         });
//       }
//     }
//   }

//   pageEmitter: PageFileEmitter;
//   component: HierarchicalNodeJSON;
//   variants: Variant[];

//   get readableIDs() {
//     return this.pageEmitter.readableIDs;
//   }

//   emit(): HumanReadable.ComponentNode {
//     return {
//       type: "component",
//       props: {
//         id: this.readableIDs.get(this.component.id) ?? "ID not found",
//       },
//       children: [
//         this.pageEmitter.emitNode(this.component.children[0], this.variants),
//         ...this.emitVariants(),
//       ],
//     };
//   }

//   emitVariants(): HumanReadable.VariantNode[] {
//     return compact(
//       this.variants.map((variant) => {
//         return { type: "variant", props: { condition: variant.condition } };
//       })
//     );
//   }
// }
