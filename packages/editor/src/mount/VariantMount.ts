import { action, reaction } from "mobx";
import { Component } from "../models/Component";
import { DefaultVariant, Variant } from "../models/Variant";
import { captureDOM } from "../util/CaptureDOM";
import { MountContext } from "./MountContext";
import { RootElementMount } from "./RootElementMount";

export class VariantMount {
  constructor(
    component: Component,
    variant: Variant | DefaultVariant,
    context: MountContext
  ) {
    this.component = component;
    this.variant = variant;
    this.context = context;

    this.rootMount = new RootElementMount(component, variant, context);

    this.dom = context.domDocument.createElement("div");
    this.dom.append(this.rootMount.dom);

    this.dom.style.position = "absolute";
    this.dom.style.display = "flex";
    this.dom.style.flexDirection = "column";

    context.registry?.setVariantMount(this);

    this.disposers.push(
      reaction(
        () => ({
          x: this.variant.x,
          y: this.variant.y,
          width: this.variant.width,
          height: this.variant.height,
        }),
        ({ x, y, width, height }) => {
          this.dom.style.left = `${x}px`;
          this.dom.style.top = `${y}px`;
          this.dom.style.width =
            width === undefined ? `max-content` : `${width}px`;
          this.dom.style.height =
            height === undefined ? `max-content` : `${height}px`;
          this.rootMount.updateBoundingBoxLater();
        },
        { fireImmediately: true }
      ),
      reaction(
        () => this.variant.backgroundColor,
        (backgroundColor) => {
          this.dom.style.backgroundColor = backgroundColor ?? "white";
        },
        {
          fireImmediately: true,
        }
      )
    );

    if (this.variant.type === "defaultVariant") {
      this.disposers.push(
        // update thumbnail on commit
        reaction(
          () => this.context.editorState.history.undoStack.commandToUndo,
          () => {
            this.updateThumbnail();
          },
          { fireImmediately: true }
        )
      );
    }
  }

  dispose(): void {
    if (this.isDisposed) {
      throw new Error("VariantMount is already disposed");
    }

    this.rootMount.dispose();

    this.disposers.forEach((disposer) => disposer());

    this.context.registry?.deleteVariantMount(this);

    this.isDisposed = true;
  }

  private isDisposed = false;
  private readonly disposers: (() => void)[] = [];

  readonly component: Component;
  readonly variant: Variant | DefaultVariant;
  readonly context: MountContext;

  readonly dom: HTMLDivElement;

  readonly rootMount: RootElementMount;

  updateThumbnail(): void {
    setTimeout(() => {
      void captureDOM(this.rootMount.dom, 512).then(
        action((thumb) => {
          this.component.thumbnail = thumb;
        })
      );
    }, 0);
  }
}
