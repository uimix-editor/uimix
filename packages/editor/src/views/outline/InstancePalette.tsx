import { compact } from "lodash-es";
import { observer } from "mobx-react-lite";
import { Component } from "../../models/Component";
import { projectState } from "../../state/ProjectState";
import { SearchInput } from "./SearchInput";
import {
  ForeignComponentRenderer,
  NodeRenderer,
} from "../viewport/renderer/NodeRenderer";
import { usePointerStroke } from "@uimix/foundation/src/components/hooks/usePointerStroke";
import { viewportGeometry } from "../../state/ScrollState";
import { NodeMoveDragHandler } from "../viewport/dragHandler/NodeMoveDragHandler";
import { ReactNode, useRef, useState } from "react";
import { DragHandler } from "../viewport/dragHandler/DragHandler";
import { Vec2 } from "paintvec";
import { useResizeObserver } from "@uimix/foundation/src/components/hooks/useResizeObserver";
import { QueryTester } from "@uimix/foundation/src/utils/QueryTester";
import { ForeignComponentManager } from "../../models/ForeignComponentManager";
import { IFrame } from "../components/IFrame";
import { action, makeObservable, observable } from "mobx";
import colors from "@uimix/foundation/src/colors";
import { Color } from "@uimix/foundation/src/utils/Color";
import { FontLoader } from "../viewport/renderer/FontLoader";
import { dialogState } from "../../state/DialogState";
import { ForeignComponent } from "../../types/ForeignComponent";
import { ViewportEvent } from "../viewport/dragHandler/ViewportEvent";

class InstancePaletteState {
  constructor() {
    makeObservable(this);
  }

  @observable searchText = "";
}

const instancePaletteState = new InstancePaletteState();

export const InstancePalette: React.FC = observer(() => {
  return (
    <div className="flex flex-col h-full w-[256px] bg-macaron-background border-r border-macaron-separator">
      <SearchInput
        placeholder="Search"
        value={instancePaletteState.searchText}
        onChangeValue={action((value) => {
          instancePaletteState.searchText = value;
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

InstancePalette.displayName = "InstancePalette";

const ComponentThumbnails: React.FC<{
  foreignComponentManager: ForeignComponentManager;
  iframe: HTMLIFrameElement;
}> = observer(({ foreignComponentManager, iframe }) => {
  const pages = projectState.project.pages.all;
  const queryTester = new QueryTester(instancePaletteState.searchText);

  const sections = compact(
    pages.map((page) => {
      const components = compact(
        page.node.children.map((c) => {
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
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          React Components
          <button
            style={{
              color: colors.icon,
              background: "none",
              border: "none",
              cursor: "pointer",
              font: "inherit",
            }}
            onClick={action(() => {
              dialogState.foreignComponentListDialogOpen = true;
            })}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6.66667 12.6667C6.47778 12.6667 6.31956 12.6027 6.192 12.4747C6.064 12.3472 6 12.189 6 12.0001C6 11.8112 6.064 11.653 6.192 11.5254C6.31956 11.3974 6.47778 11.3334 6.66667 11.3334H13.3333C13.5222 11.3334 13.6804 11.3974 13.808 11.5254C13.936 11.653 14 11.8112 14 12.0001C14 12.189 13.936 12.3472 13.808 12.4747C13.6804 12.6027 13.5222 12.6667 13.3333 12.6667H6.66667ZM6.66667 8.66675C6.47778 8.66675 6.31956 8.60275 6.192 8.47475C6.064 8.34719 6 8.18897 6 8.00008C6 7.81119 6.064 7.65275 6.192 7.52475C6.31956 7.39719 6.47778 7.33341 6.66667 7.33341H13.3333C13.5222 7.33341 13.6804 7.39719 13.808 7.52475C13.936 7.65275 14 7.81119 14 8.00008C14 8.18897 13.936 8.34719 13.808 8.47475C13.6804 8.60275 13.5222 8.66675 13.3333 8.66675H6.66667ZM6.66667 4.66675C6.47778 4.66675 6.31956 4.60297 6.192 4.47541C6.064 4.34741 6 4.18897 6 4.00008C6 3.81119 6.064 3.65275 6.192 3.52475C6.31956 3.39719 6.47778 3.33341 6.66667 3.33341H13.3333C13.5222 3.33341 13.6804 3.39719 13.808 3.52475C13.936 3.65275 14 3.81119 14 4.00008C14 4.18897 13.936 4.34741 13.808 4.47541C13.6804 4.60297 13.5222 4.66675 13.3333 4.66675H6.66667ZM3.33333 13.3334C2.96667 13.3334 2.65267 13.203 2.39133 12.9421C2.13044 12.6807 2 12.3667 2 12.0001C2 11.6334 2.13044 11.3194 2.39133 11.0581C2.65267 10.7972 2.96667 10.6667 3.33333 10.6667C3.7 10.6667 4.01378 10.7972 4.27467 11.0581C4.536 11.3194 4.66667 11.6334 4.66667 12.0001C4.66667 12.3667 4.536 12.6807 4.27467 12.9421C4.01378 13.203 3.7 13.3334 3.33333 13.3334ZM3.33333 9.33341C2.96667 9.33341 2.65267 9.20275 2.39133 8.94141C2.13044 8.68053 2 8.36675 2 8.00008C2 7.63341 2.13044 7.31941 2.39133 7.05808C2.65267 6.79719 2.96667 6.66675 3.33333 6.66675C3.7 6.66675 4.01378 6.79719 4.27467 7.05808C4.536 7.31941 4.66667 7.63341 4.66667 8.00008C4.66667 8.36675 4.536 8.68053 4.27467 8.94141C4.01378 9.20275 3.7 9.33341 3.33333 9.33341ZM3.33333 5.33341C2.96667 5.33341 2.65267 5.20275 2.39133 4.94141C2.13044 4.68053 2 4.36675 2 4.00008C2 3.63341 2.13044 3.31964 2.39133 3.05875C2.65267 2.79741 2.96667 2.66675 3.33333 2.66675C3.7 2.66675 4.01378 2.79741 4.27467 3.05875C4.536 3.31964 4.66667 3.63341 4.66667 4.00008C4.66667 4.36675 4.536 4.68053 4.27467 4.94141C4.01378 5.20275 3.7 5.33341 3.33333 5.33341Z"
                fill="currentColor"
              />
            </svg>
          </button>
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
    onBegin: async () => {
      status.current.creating = false;
    },
    onMove: (e, {}) => {
      const clientX = e.clientX + iframe.getBoundingClientRect().left;
      const clientY = e.clientY + iframe.getBoundingClientRect().top;
      const clientPos = new Vec2(clientX, clientY);

      if (!status.current.dragHandler && !status.current.creating) {
        const isInViewport = viewportGeometry.domClientRect.includes(
          new Vec2(clientX, clientY)
        );
        if (isInViewport) {
          const { project, page, scroll } = projectState;
          if (!page) {
            return;
          }

          const pos = scroll.documentPosForClientPos(clientPos);

          const instanceNode = project.nodes.create(
            component instanceof Component ? "instance" : "foreign"
          );
          page.node.append([instanceNode]);

          const instanceNodeStyle = instanceNode.selectable.style;
          instanceNodeStyle.position = {
            x: { type: "start", start: pos.x },
            y: { type: "start", start: pos.y },
          };
          // TODO: exotic component
          if (component instanceof Component) {
            instanceNodeStyle.mainComponent = component.node.id;
            instanceNode.name = component.node.name;
          } else {
            instanceNodeStyle.foreignComponent = {
              type: "react",
              path: component.path,
              name: component.name,
              props: {
                label: "Button",
              },
            };
            instanceNodeStyle.width = {
              type: "hug",
            };
            instanceNodeStyle.height = {
              type: "hug",
            };
            instanceNode.name = component.name;
          }

          project.clearSelection();
          instanceNode.selectable.select();

          status.current.creating = true;
          setTimeout(() => {
            status.current.dragHandler = new NodeMoveDragHandler(
              [instanceNode.selectable],
              pos
            );
          }, 100); // TODO: avoid magic number
        }
      }
      status.current.dragHandler?.move(
        new ViewportEvent(e.nativeEvent, {
          clientPos,
        })
      );
    },
    onEnd: (e) => {
      if (status.current.dragHandler) {
        const clientX = e.clientX + iframe.getBoundingClientRect().left;
        const clientY = e.clientY + iframe.getBoundingClientRect().top;

        status.current.dragHandler.end(
          new ViewportEvent(e.nativeEvent, {
            clientPos: new Vec2(clientX, clientY),
          })
        );
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
            <ForeignComponentRenderer component={component} props={{}} />
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
          color: colors.text,
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
          height: `${contentSize[1] * scale}px`,
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
