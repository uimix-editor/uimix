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

    this.disposers = [
      reaction(
        () => instance.text.content,
        (content) => {
          this.dom.textContent = content;
        }
      ),
    ];
    this.registry.setTextMount(this);
  }

  dispose(): void {
    this.disposers.forEach((disposer) => disposer());
    this.registry.deleteTextMount(this);
  }

  get type(): "text" {
    return "text";
  }

  readonly instance: TextInstance;
  readonly domDocument: globalThis.Document;
  readonly dom: globalThis.Text;
  readonly registry: MountRegistry;
  private readonly disposers: (() => void)[] = [];
}
