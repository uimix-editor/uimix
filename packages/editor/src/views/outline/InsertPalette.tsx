import { compact } from "lodash-es";
import { observer } from "mobx-react-lite";
import { Component } from "../../models/Component";
import { projectState } from "../../state/ProjectState";
import { SearchInput } from "./SearchInput";
import {
  ForeignComponentRenderer,
  NodeRenderer,
} from "../viewport/renderer/NodeRenderer";
import { usePointerStroke } from "../../components/hooks/usePointerStroke";
import { scrollState } from "../../state/ScrollState";
import { NodeAbsoluteMoveDragHandler } from "../viewport/dragHandler/NodeAbsoluteMoveDragHandler";
import { ReactNode, useRef, useState } from "react";
import { DragHandler } from "../viewport/dragHandler/DragHandler";
import { Vec2 } from "paintvec";
import { useResizeObserver } from "../../components/hooks/useResizeObserver";
import { QueryTester } from "../../utils/QueryTester";
import {
  ForeignComponent,
  ForeignComponentManager,
} from "../../models/ForeignComponentManager";
import { IFrame } from "../../components/IFrame";
import { action, makeObservable, observable } from "mobx";
import colors from "../../colors";
import { Color } from "../../utils/Color";
import { FontLoadLink } from "../../components/FontLoadLink";
import { FontLoader } from "../viewport/renderer/FontLoader";

class InsertPaletteState {
  constructor() {
    makeObservable(this);
  }

  @observable searchText = "";
}

const insertPaletteState = new InsertPaletteState();

export const InsertPalette: React.FC = observer(() => {
  return (
    <div className="flex flex-col h-full">
      <SearchInput
        placeholder="Search"
        value={insertPaletteState.searchText}
        onChangeValue={action((value) => {
          insertPaletteState.searchText = value;
        })}
      />
      <div className="flex-1 relative">
        <IFrame
          className="absolute inset-0 w-full h-full"
          init={(window, iframe) => {
            const foreignComponentManager = new ForeignComponentManager(window);

            return (
              <>
                <FontLoader />
                <ComponentThumbnails
                  foreignComponentManager={foreignComponentManager}
                  iframe={iframe}
                />
              </>
            );
          }}
        />
      </div>
    </div>
  );
});

InsertPalette.displayName = "InsertPalette";

const ComponentThumbnails: React.FC<{
  foreignComponentManager: ForeignComponentManager;
  iframe: HTMLIFrameElement;
}> = observer(({ foreignComponentManager, iframe }) => {
  const pages = projectState.project.pages.all;
  const queryTester = new QueryTester(insertPaletteState.searchText);

  const sections = compact(
    pages.map((page) => {
      const components = compact(
        page.children.map((c) => {
          if (queryTester.test(c.name)) return Component.from(c);
        })
      );
      if (!components.length) {
        return null;
      }

      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <h2
            style={{
              fontSize: "12px",
              lineHeight: "16px",
              color: colors.label,
              fontWeight: 500,
              padding: "0 2px",
              margin: 0,
            }}
          >
            {page.name}
          </h2>
          {components.map((c) => (
            <ComponentThumbnail
              component={c}
              foreignComponentManager={foreignComponentManager}
              iframe={iframe}
            />
          ))}
        </div>
      );
    })
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "12px",
        fontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
        userSelect: "none",
      }}
    >
      {sections}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <h2
          style={{
            fontSize: "12px",
            lineHeight: "16px",
            color: colors.label,
            fontWeight: 500,
            padding: "0 2px",
            margin: 0,
          }}
        >
          React Components
        </h2>
        {[...foreignComponentManager.components.values()].map((c) => (
          <ComponentThumbnail
            component={c}
            foreignComponentManager={foreignComponentManager}
            iframe={iframe}
          />
        ))}
      </div>
    </div>
  );
});

const ComponentThumbnail: React.FC<{
  component: Component | ForeignComponent;
  foreignComponentManager: ForeignComponentManager;
  iframe: HTMLIFrameElement;
}> = observer(({ component, foreignComponentManager, iframe }) => {
  const status = useRef<{
    dragHandler: DragHandler | undefined;
    creating: boolean;
  }>({
    dragHandler: undefined,
    creating: false,
  });

  const dragProps = usePointerStroke({
    onBegin: async (e) => {
      status.current.creating = false;
    },
    onMove: (e, {}) => {
      const clientX = e.clientX + iframe.getBoundingClientRect().left;
      const clientY = e.clientY + iframe.getBoundingClientRect().top;

      const proxiedEvent = new Proxy(e.nativeEvent, {
        get(target, property) {
          if (property === "clientX") return clientX;
          if (property === "clientY") return clientY;

          // @ts-ignore
          return target[property];
        },
      });

      if (!status.current.dragHandler && !status.current.creating) {
        const isInViewport = scrollState.viewportDOMClientRect.includes(
          new Vec2(clientX, clientY)
        );
        if (isInViewport) {
          const pos = scrollState.documentPosForEvent(proxiedEvent);

          const project = projectState.project;
          const page = projectState.page;
          if (!page) {
            return;
          }

          const instanceNode = project.nodes.create(
            component instanceof Component ? "instance" : "foreign"
          );
          page.append([instanceNode]);

          const instanceNodeStyle = instanceNode.selectable.style;
          instanceNodeStyle.position = {
            x: { type: "start", start: pos.x },
            y: { type: "start", start: pos.y },
          };
          // TODO: exotic component
          if (component instanceof Component) {
            instanceNodeStyle.mainComponentID = component.node.id;
            instanceNode.name = component.node.name;
          } else {
            instanceNodeStyle.foreignComponentID = {
              type: "react",
              path: component.path,
              name: component.name,
              props: {
                label: "Button",
              },
            };
            instanceNodeStyle.width = {
              type: "hugContents",
            };
            instanceNodeStyle.height = {
              type: "hugContents",
            };
            instanceNode.name = component.name;
          }

          page.selectable.deselect();
          instanceNode.selectable.select();

          status.current.creating = true;
          setTimeout(() => {
            status.current.dragHandler = new NodeAbsoluteMoveDragHandler(
              [instanceNode.selectable],
              pos
            );
          }, 100); // TODO: avoid magic number
        }
      }
      status.current.dragHandler?.move(proxiedEvent);
    },
    onEnd: (e) => {
      if (status.current.dragHandler) {
        status.current.dragHandler.end(e.nativeEvent);
        status.current.dragHandler = undefined;
      }
    },
  });

  const [hover, setHover] = useState(false);

  return (
    <div
      style={{
        padding: "8px",
        backgroundColor: colors.uiBackground,
        border: `1px solid ${colors.separator}`,
        borderRadius: "4px",
        position: "relative",
        cursor: "copy",
        overflow: "hidden",
      }}
      {...dragProps}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <ThumbnailResizer>
        {component instanceof Component ? (
          <NodeRenderer
            selectable={component.rootNode.selectable}
            style={{
              position: "relative",
              left: 0,
              top: 0,
            }}
            foreignComponentManager={foreignComponentManager}
            forThumbnail
          />
        ) : (
          <div
            style={{
              width: "max-content",
              height: "max-content",
            }}
          >
            <ForeignComponentRenderer
              component={component}
              manager={foreignComponentManager}
              props={{}}
            />
          </div>
        )}
      </ThumbnailResizer>
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          right: 0,
          textAlign: "center",
          color: colors.label,
          fontSize: "12px",
          lineHeight: "16px",
          padding: "4px",
          backgroundColor: Color.from(colors.label)?.withAlpha(0.3).toString(),
          opacity: hover ? 1 : 0,
          transition: "opacity 0.2s",
        }}
      >
        {component instanceof Component
          ? component.node.name
          : `${component.path} - ${component.name}`}
      </div>
    </div>
  );
});
ComponentThumbnail.displayName = "ComponentThumbnail";

const ThumbnailResizer: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const wrapperSize = useResizeObserver(wrapperRef);
  const contentSize = useResizeObserver(contentRef);
  const scale = Math.min(wrapperSize[0] / contentSize[0], 1);

  return (
    <div
      style={{
        width: "100%",
        pointerEvents: "none",
      }}
      ref={wrapperRef}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          height: contentSize[1] * scale + "px",
        }}
      >
        <div
          style={{
            width: "fit-content",
            height: "fit-content",
            position: "absolute",
          }}
          ref={contentRef}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
