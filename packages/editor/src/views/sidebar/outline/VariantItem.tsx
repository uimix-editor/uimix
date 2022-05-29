import React from "react";
import {
  TreeRow,
  TreeRowLabel,
} from "@seanchas116/paintkit/src/components/treeview/TreeRow";
import switchIcon from "@seanchas116/paintkit/src/icon/Switch";
import { makeObservable } from "mobx";
import { DefaultVariant, Variant } from "../../../models/Variant";
import { ElementInstance } from "../../../models/ElementInstance";
import { VARIANT_DRAG_MIME } from "./Common";
import { ElementIcon, ElementItem } from "./ElementItem";
import { OutlineContext } from "./OutlineContext";
import { ComponentItem } from "./ComponentItem";

export class VariantItem extends ElementItem {
  constructor(
    context: OutlineContext,
    parent: ComponentItem,
    variant: Variant | DefaultVariant,
    rootInstance: ElementInstance
  ) {
    super(context, parent, rootInstance);
    this.variant = variant;
    makeObservable(this);
  }

  readonly variant: Variant | DefaultVariant;

  renderRow(options: { inverted: boolean }): React.ReactNode {
    return (
      <TreeRow
        ref={(e) => (this.rowElement = e || undefined)}
        inverted={options.inverted}
      >
        <ElementIcon icon={switchIcon} />
        <TreeRowLabel>{this.variant.name}</TreeRowLabel>
      </TreeRow>
    );
  }

  handleDragStart(e: React.DragEvent): void {
    if (this.variant.type === "defaultVariant") {
      return;
    }
    e.dataTransfer.effectAllowed = "copyMove";
    e.dataTransfer.setData(VARIANT_DRAG_MIME, "drag");
  }
}
