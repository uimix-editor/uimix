import { reaction } from "mobx";
import { Text } from "../models/Text";
import { Variant } from "../models/Variant";
import { MountRegistry } from "./MountRegistry";

export class TextMount {
  constructor(text: Text, variant: Variant, registry: MountRegistry) {
    this.text = text;
    this.variant = variant;
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
    this.registry.setTextMount(this);
  }

  dispose(): void {
    this.disposers.forEach((disposer) => disposer());
    this.registry.deleteTextMount(this);
  }

  readonly text: Text;
  readonly variant: Variant;
  readonly dom: globalThis.Text;
  readonly registry: MountRegistry;
  private readonly disposers: (() => void)[] = [];
}
