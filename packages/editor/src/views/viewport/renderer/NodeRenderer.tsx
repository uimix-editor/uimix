import React, { createRef, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { StackDirection } from "@uimix/node-data";
import { Selectable } from "../../../models/Selectable";
import { viewportState } from "../../../state/ViewportState";
import { ComputedRectProvider } from "./ComputedRectProvider";
import { projectState } from "../../../state/ProjectState";
import {
  ForeignComponent,
  ForeignComponentRenderer as IForeignComponentRenderer,
} from "../../../types/ForeignComponent";
import { ForeignComponentManager } from "../../../models/ForeignComponentManager";
import { buildNodeCSS, getLayoutType } from "../../../models/buildNodeCSS";
import htmlReactParser from "html-react-parser";

export const selectableForDOM = new WeakMap<HTMLElement, Selectable>();
export const domForSelectable = new WeakMap<Selectable, HTMLElement>();

class ComputedRectUpdater {
  private dirtyTopLevels = new Set<Selectable>();

  add(selectable: Selectable) {
    let topLevel = selectable;
    while (true) {
      const parent = topLevel.parent;
      if (!parent || parent.node.type === "page") break;
      topLevel = parent;
    }

    if (topLevel) {
      this.dirtyTopLevels.add(topLevel);
    }
  }

  flush() {
    for (const topLevel of this.dirtyTopLevels) {
      const markDirtyRecursive = (selectable: Selectable) => {
        selectable.computedRectProvider?.markDirty();
        selectable.children.forEach(markDirtyRecursive);
      };
      markDirtyRecursive(topLevel);
    }
    this.dirtyTopLevels.clear();
  }
}
const computedRectUpdater = new ComputedRectUpdater();

export const NodeRenderer: React.FC<{
  selectable: Selectable;
  parentLayout?: StackDirection | "grid";
  forThumbnail?: boolean; // must not be changed after mount
  style?: React.CSSProperties;
  foreignComponentManager: ForeignComponentManager;
}> = observer(
  ({
    selectable,
    parentLayout,
    forThumbnail,
    style: additionalCSSStyle,
    foreignComponentManager,
  }) => {
    const node = selectable.node;
    const style = selectable.style;
    const type = selectable.node.type;

    const cssStyle: React.CSSProperties = {
      all: "revert",
      boxSizing: "border-box",
      ...buildNodeCSS(
        type,
        style,
        (tokenID) => selectable.project.colorTokens.resolve(tokenID),
        parentLayout
      ),
      ...(selectable === viewportState.focusedSelectable
        ? {
            opacity: 0,
          }
        : undefined),
      ...additionalCSSStyle,
    };

    const ref = createRef<HTMLDivElement | HTMLImageElement>();

    if (!forThumbnail) {
      useEffect(() => {
        if (ref.current) {
          selectable.computedRectProvider = new ComputedRectProvider(
            ref.current
          );
        }
      }, []);

      computedRectUpdater.add(selectable);

      useEffect(() => {
        if (ref.current) {
          selectableForDOM.set(ref.current, selectable);
          domForSelectable.set(selectable, ref.current);
        }

        computedRectUpdater.flush();
      });
    }

    const layoutType = type === "frame" ? getLayoutType(style) : undefined;

    // if (selectable.node.type === "instance") {
    //   return (
    //     <InstanceRenderer
    //       instanceSelectable={selectable}
    //       domRef={ref}
    //       parentStackDirection={stackDirection}
    //     />
    //   );
    // }

    // if (selectable.node.type === "shape") {
    //   const pathData = selectable.node.path.toSVGPathData();
    //   return (
    //     <div style={cssStyle} ref={ref}>
    //       <svg
    //         style={{
    //           width: "100%",
    //           height: "100%",
    //         }}
    //         viewBox={[
    //           selectable.node.viewBox.left,
    //           selectable.node.viewBox.top,
    //           selectable.node.viewBox.width,
    //           selectable.node.viewBox.height,
    //         ].join(" ")}
    //         preserveAspectRatio="none"
    //       >
    //         <path fillRule="evenodd" d={pathData} />
    //       </svg>
    //     </div>
    //   );
    // }

    // if (selectable.node.type === "image") {
    //   return (
    //     <img
    //       style={{
    //         // reset Tailwind styles
    //         maxWidth: "unset",
    //         height: "unset",
    //         objectFit: "cover",
    //         ...cssStyle,
    //       }}
    //       src={selectable.node.source.dataURL}
    //       width={selectable.node.source.width}
    //       height={selectable.node.source.height}
    //       ref={ref as React.RefObject<HTMLImageElement>}
    //     />
    //   );
    // }

    if (node.type === "image") {
      const hash = style.imageHash;
      const dataURL = hash
        ? projectState.project.imageManager.get(hash)?.url
        : undefined;
      return (
        <img
          style={{
            ...cssStyle,
            objectFit: "cover", // TODO: make configurable
          }}
          ref={ref as React.RefObject<HTMLImageElement>}
          src={dataURL}
        />
      );
    }

    if (node.type === "svg") {
      const svg = style.svgContent.trim();
      const svgElement = svg ? htmlReactParser(svg) : undefined;
      if (!React.isValidElement(svgElement)) {
        console.log("invalid svg", svg);
        return <div style={cssStyle} ref={ref} />;
      }

      // TODO: copy all presentation attributes to styles
      // @ts-ignore
      if (svgElement.props.fill) {
        // @ts-ignore
        // eslint-disable-next-line
        cssStyle.fill = svgElement.props.fill;
      }
      // @ts-ignore
      if (svgElement.props.stroke) {
        // @ts-ignore
        // eslint-disable-next-line
        cssStyle.fill = svgElement.props.stroke;
      }

      // TODO: resolve this messy typing
      return React.cloneElement(svgElement, {
        // @ts-ignore
        style: cssStyle,
        ref,
      });
    }

    if (node.type === "foreign") {
      const foreignComponentID = style.foreignComponent;
      const foreignComponent = foreignComponentID
        ? foreignComponentManager?.get(foreignComponentID)
        : undefined;
      return (
        <div style={cssStyle} ref={ref}>
          {foreignComponent && (
            <ForeignComponentRenderer
              component={foreignComponent}
              onRenderFinish={() => {
                if (!forThumbnail) {
                  computedRectUpdater.add(selectable);
                  computedRectUpdater.flush();
                }
              }}
              props={foreignComponentID?.props ?? {}}
            />
          )}
        </div>
      );
    }

    return (
      <div style={cssStyle} ref={ref}>
        {type === "text"
          ? String(style.textContent) // support prop ref
          : selectable.children.map((child) => (
              <NodeRenderer
                key={child.id}
                selectable={child}
                parentLayout={layoutType}
                forThumbnail={forThumbnail}
                foreignComponentManager={foreignComponentManager}
              />
            ))}
      </div>
    );
  }
);

export const ForeignComponentRenderer: React.FC<{
  component: ForeignComponent;
  onRenderFinish?: () => void;
  props: Record<string, unknown>;
}> = observer(({ component, onRenderFinish, props }) => {
  // TODO: reduce DOM nesting

  const ref = createRef<HTMLDivElement>();
  const onRenderFinishRef = useRef(onRenderFinish);
  onRenderFinishRef.current = onRenderFinish;

  const rendererRef = useRef<IForeignComponentRenderer>();

  useEffect(() => {
    const elem = ref.current;
    if (!elem) return;

    const renderer = component.createRenderer(elem);
    rendererRef.current = renderer;
    return () => {
      renderer.dispose();
    };
  }, [component]);

  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;
    void renderer.render(props).then(() => onRenderFinish?.());
  }, [props]);

  return (
    <div
      ref={ref}
      style={{
        display: "contents",
      }}
    />
  );
});
