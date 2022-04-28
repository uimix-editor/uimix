import { reaction } from "mobx";
import { TextInstance } from "../models/TextInstance";
import { MountContext } from "./MountContext";

export class TextMount {
  constructor(
    instance: TextInstance,
    context: MountContext,
    domDocument: globalThis.Document
  ) {
    this.instance = instance;
    this.domDocument = domDocument;
    this.dom = domDocument.createTextNode(instance.text.content);
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

  private isDisposed = false;
  private readonly disposers: (() => void)[] = [];

  readonly instance: TextInstance;
  readonly domDocument: globalThis.Document;
  readonly dom: globalThis.Text;
  readonly context: MountContext;
}
