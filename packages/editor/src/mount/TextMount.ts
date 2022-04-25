import { reaction } from "mobx";
import { TextInstance } from "../models/TextInstance";
import { MountRegistry } from "./MountRegistry";

export class TextMount {
  constructor(
    instance: TextInstance,
    registry: MountRegistry,
    domDocument: globalThis.Document
  ) {
    this.instance = instance;
    this.domDocument = domDocument;
    this.dom = domDocument.createTextNode(instance.text.content);
    this.registry = registry;
    this.registry.setTextMount(this);

    this.disposers = [
      reaction(
        () => instance.text.content,
        (content) => {
          this.dom.textContent = content;
        }
      ),
    ];
  }

  dispose(): void {
    if (this.isDisposed) {
      throw new Error("TextMount is already disposed");
    }

    this.disposers.forEach((disposer) => disposer());
    this.registry.deleteTextMount(this);

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
  readonly registry: MountRegistry;
}
