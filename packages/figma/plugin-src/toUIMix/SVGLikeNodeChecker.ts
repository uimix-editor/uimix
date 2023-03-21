const vectorLikeTypes: SceneNode["type"][] = [
  "LINE",
  "RECTANGLE",
  "ELLIPSE",
  "POLYGON",
  "STAR",
  "VECTOR",
  "BOOLEAN_OPERATION",
];

class SVGLikeNodeChecker {
  private readonly memo = new WeakMap<SceneNode, boolean>();

  check(
    node: SceneNode
  ): node is
    | LineNode
    | RectangleNode
    | EllipseNode
    | PolygonNode
    | StarNode
    | VectorNode
    | BooleanOperationNode {
    const memo = this.memo.get(node);
    if (memo != null) {
      return memo;
    }

    // TODO: check if node is from Material Symbols plugin

    if (vectorLikeTypes.includes(node.type)) {
      return true;
    }

    // TODO: text layers with strokes should be treated as SVG

    if (
      node.type === "FRAME" ||
      node.type === "INSTANCE" ||
      node.type === "COMPONENT" ||
      node.type === "COMPONENT_SET"
    ) {
      return this.checkFrameLike(node);
    }

    return false;
  }

  private checkFrameLike(
    node: FrameNode | ComponentNode | ComponentSetNode | InstanceNode
  ): boolean {
    if (node.children.length === 0) {
      return false;
    }

    for (const child of node.children) {
      if (!this.check(child)) {
        return false;
      }
      if ("constraints" in child) {
        if (
          child.constraints.horizontal !== "SCALE" ||
          child.constraints.vertical !== "SCALE"
        ) {
          return false;
        }
      }
    }

    return true;
  }
}

export const svgLikeNodeChecker = new SVGLikeNodeChecker();
