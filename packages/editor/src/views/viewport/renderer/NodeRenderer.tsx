import React, { createRef, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { buildNodeCSS } from "@uimix/render";
import { Selectable } from "../../../models/Selectable";
import { viewportState } from "../../../state/ViewportState";
import { ComputedRectProvider } from "./ComputedRectProvider";
import { projectState } from "../../../state/ProjectState";
import {
  ForeignComponent,
  ForeignComponentManager,
} from "../../../models/ForeignComponentManager";
import { EventEmitter } from "../../../utils/EventEmitter";

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
  parentHasLayout?: boolean;
  forThumbnail?: boolean; // must not be changed after mount
  style?: React.CSSProperties;
  foreignComponentManager: ForeignComponentManager;
}> = observer(
  ({
    selectable,
    parentHasLayout,
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
      ...buildNodeCSS(type, style, parentHasLayout),
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

    const hasLayout = type === "frame" && style.layout === "stack";

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
        ? projectState.project.imageManager.get(hash)?.dataURL
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

    if (node.type === "foreign") {
      const foreignComponentID = style.foreignComponentID;
      const foreignComponent = foreignComponentID
        ? foreignComponentManager?.get(foreignComponentID)
        : undefined;
      return (
        <div style={cssStyle} ref={ref}>
          {foreignComponent && (
            <ForeignComponentRenderer
              manager={foreignComponentManager}
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
                parentHasLayout={hasLayout}
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
  manager: ForeignComponentManager;
  onRenderFinish?: () => void;
  props: Record<string, unknown>;
}> = observer(({ component, manager, onRenderFinish, props }) => {
  // TODO: reduce DOM nesting

  const ref = createRef<HTMLDivElement>();
  const onRenderFinishRef = useRef(onRenderFinish);
  onRenderFinishRef.current = onRenderFinish;

  const [propsChanged] = useState(
    () => new EventEmitter<Record<string, unknown>>()
  );
  propsChanged.emit(props);

  const { React, ReactDOM } = manager;

  useEffect(() => {
    const elem = ref.current;
    if (!elem) return;

    if (!React || !ReactDOM) return;

    const RootComponent = () => {
      const [_props, _setProps] = React.useState(props);
      React.useEffect(() => {
        return propsChanged.event((newProps) => {
          _setProps(newProps);
        });
      }, []);

      return React.createElement(
        "div",
        {
          style: {
            display: "contents",
          },
          ref: () => {
            onRenderFinishRef.current?.();
          },
        },
        React.createElement(component.component, _props)
      );
    };

    const reactRoot = ReactDOM.createRoot(elem);
    reactRoot.render(React.createElement(RootComponent));

    return () => {
      onRenderFinishRef.current = undefined;
      reactRoot.unmount();
    };
  }, [React, ReactDOM]);

  return (
    <div
      ref={ref}
      style={{
        display: "contents",
      }}
    />
  );
});
