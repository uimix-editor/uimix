import { reaction } from "mobx";
import { Text } from "../models/Text";
import { MountRegistry } from "./MountRegistry";

export class TextMount {
  constructor(text: Text, registry: MountRegistry) {
    this.text = text;
    this.dom = document.createTextNode(text.content);
    this.registry = registry;

    this.disposers = [
      reaction(
        () => text.content,
        (content) => {
          this.dom.textContent = content;
        }
      ),
    ];
    this.registry.textMounts.set(text, this);
  }

  dispose(): void {
    this.disposers.forEach((disposer) => disposer());
    this.registry.textMounts.deleteValue(this.text, this);
  }

  readonly text: Text;
  readonly dom: globalThis.Text;
  readonly registry: MountRegistry;
  private readonly disposers: (() => void)[] = [];
}
