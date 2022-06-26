import { Component } from "../models/Component";
import { DefaultVariant, Variant } from "../models/Variant";
import { EditorState } from "../state/EditorState";
import { BoundingBoxUpdateScheduler } from "./BoundingBoxUpdateScheduler";
import { ComponentStyleMount } from "./ComponentStyleMount";
import { MountRegistry } from "./MountRegistry";

export interface MountContext {
  readonly editorState: EditorState;
  readonly domDocument: globalThis.Document;
  readonly resetStyleSheet: CSSStyleSheet;
  readonly componentStyleMounts: Map<Component, ComponentStyleMount>;
  readonly registry?: MountRegistry;
  readonly boundingBoxUpdateScheduler?: BoundingBoxUpdateScheduler;
  readonly topLevelVariant?: Variant | DefaultVariant;
}
