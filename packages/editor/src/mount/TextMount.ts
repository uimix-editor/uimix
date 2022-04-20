import { reaction } from "mobx";
import { Text } from "../models/Text";

export class TextMount {
  constructor(text: Text) {
    this.text = text;
    this.dom = document.createTextNode(text.content);

    this.disposers = [
      reaction(
        () => text.content,
        (content) => {
          this.dom.textContent = content;
        }
      ),
    ];
  }

  dispose(): void {
    this.disposers.forEach((disposer) => disposer());
  }

  readonly text: Text;
  readonly dom: globalThis.Text;
  private readonly disposers: (() => void)[] = [];
}
