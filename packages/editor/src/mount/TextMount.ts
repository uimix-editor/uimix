import { reaction } from "mobx";
import { Rect } from "paintvec";
import { TextInstance } from "../models/TextInstance";
import { ElementMount } from "./ElementMount";
import { MountContext } from "./MountContext";
import { RootElementMount } from "./RootElementMount";

export class TextMount {
  constructor(
    parent: ElementMount | RootElementMount,
    instance: TextInstance,
    context: MountContext
  ) {
    this.parent = parent;
    this.instance = instance;
    this.dom = context.domDocument.createTextNode(instance.text.content);
    this.context = context;
    this.context.registry.setTextMount(this);

    this.disposers = [
      reaction(
        () => instance.text.content,
        (content) => {
          this.dom.textContent = content;

          const parent = this.instance.parent;
          if (parent) {
            const parentMount = this.context.registry.getElementMount(parent);
            parentMount?.updateBoundingBoxLater();
          }
        }
      ),
    ];
  }

  dispose(): void {
    if (this.isDisposed) {
      throw new Error("TextMount is already disposed");
    }

    this.disposers.forEach((disposer) => disposer());
    this.context.registry.deleteTextMount(this);

    this.isDisposed = true;
  }

  get type(): "text" {
    return "text";
  }

  get root(): RootElementMount {
    return this.parent.root;
  }

  updateBoundingBox(): void {
    const range = this.context.domDocument.createRange();
    range.selectNodeContents(this.dom);
    const rect = range.getBoundingClientRect();

    const viewportToDocument =
      this.context.editorState.scroll.viewportToDocument;
    this.instance.boundingBox = Rect.from(rect).transform(viewportToDocument);
  }

  private isDisposed = false;
  private readonly disposers: (() => void)[] = [];

  readonly parent: ElementMount | RootElementMount;
  readonly instance: TextInstance;
  readonly dom: globalThis.Text;
  readonly context: MountContext;
}
