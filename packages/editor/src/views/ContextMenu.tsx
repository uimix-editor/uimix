import { useMenuState } from "ariakit";
import { useEffect, useState } from "react";
import { Menu } from "@uimix/foundation/src/components/Menu";
import { MenuItemDef } from "@uimix/foundation/src/components/MenuItemDef";
import { EventEmitter } from "@uimix/foundation/src/utils/EventEmitter";

export interface ContextMenuRequest {
  clientX: number;
  clientY: number;
  defs: readonly MenuItemDef[];
}

class ContextMenuState {
  private _onShow = new EventEmitter<ContextMenuRequest>();

  get onShow() {
    return this._onShow.event;
  }

  show(
    position: {
      clientX: number;
      clientY: number;
    },
    defs: readonly MenuItemDef[]
  ) {
    this._onShow.emit({
      ...position,
      defs,
    });
  }
}

const contextMenuState = new ContextMenuState();

export function showContextMenu(
  position: {
    clientX: number;
    clientY: number;
  },
  defs: readonly MenuItemDef[]
) {
  contextMenuState.show(position, defs);
}

export function ContextMenu() {
  const [request, setRequest] = useState<ContextMenuRequest>({
    clientX: 0,
    clientY: 0,
    defs: [],
  });
  const menu = useMenuState({
    getAnchorRect: () => ({
      x: request.clientX,
      y: request.clientY,
    }),
  });

  useEffect(() => {
    return contextMenuState.onShow((request) => {
      setRequest(request);
      menu.show();
    });
  }, []);

  return <Menu state={menu} defs={request.defs} />;
}
