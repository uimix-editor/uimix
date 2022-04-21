import { reaction } from "mobx";
import { TextInstance } from "../models/TextInstance";
import { MountRegistry } from "./MountRegistry";

export class TextMount {
  constructor(instance: TextInstance, registry: MountRegistry) {
    this.instance = instance;
    this.dom = document.createTextNode(instance.text.content);
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

  readonly instance: TextInstance;
  readonly dom: globalThis.Text;
  readonly registry: MountRegistry;
  private readonly disposers: (() => void)[] = [];
}
