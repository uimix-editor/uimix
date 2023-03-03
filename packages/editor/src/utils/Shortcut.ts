import UAParser from "ua-parser-js";

const isMac = new UAParser().getOS().name === "Mac OS";

const modifiers = ["Shift", "Alt", "Mod"] as const;
type Modifier = typeof modifiers[number];

// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code/code_values
const keyCodes = {
  KeyA: "A",
  KeyB: "B",
  KeyC: "C",
  KeyD: "D",
  KeyE: "E",
  KeyF: "F",
  KeyG: "G",
  KeyH: "H",
  KeyI: "I",
  KeyJ: "J",
  KeyK: "K",
  KeyL: "L",
  KeyM: "M",
  KeyN: "N",
  KeyO: "O",
  KeyP: "P",
  KeyQ: "Q",
  KeyR: "R",
  KeyS: "S",
  KeyT: "T",
  KeyU: "U",
  KeyV: "V",
  KeyW: "W",
  KeyX: "X",
  KeyY: "Y",
  KeyZ: "Z",
  Digit1: "1",
  Digit2: "2",
  Digit3: "3",
  Digit4: "4",
  Digit5: "5",
  Digit6: "6",
  Digit7: "7",
  Digit8: "8",
  Digit9: "9",
  Digit0: "0",
  Minus: "-",
  Equal: "+",
  Escape: "Escape",
  Backspace: "Backspace",
  Delete: "Delete",
  ArrowLeft: "Left",
  ArrowRight: "Right",
  ArrowUp: "Up",
  ArrowDown: "Down",
  NumpadAdd: "+",
  NumpadSubtract: "-",
  Numpad0: "0",
  Numpad1: "1",
  Numpad2: "2",
  Numpad3: "3",
  Numpad4: "4",
  Numpad5: "5",
  Numpad6: "6",
  Numpad7: "7",
  Numpad8: "8",
  Numpad9: "9",

  // TODO: Add more
} as const;

export type KeyCode = keyof typeof keyCodes;

export class Shortcut {
  constructor(modifiers: Modifier[], code: KeyCode) {
    this.shiftKey = modifiers.includes("Shift");
    this.altKey = modifiers.includes("Alt");
    this.modKey = modifiers.includes("Mod");
    this.code = code;
  }

  readonly shiftKey: boolean;
  readonly altKey: boolean;
  readonly modKey: boolean;

  readonly code: KeyCode;

  toText(): string {
    const modifiers: string[] = [];
    if (this.shiftKey) {
      modifiers.push("⇧");
    }
    if (this.altKey) {
      modifiers.push("⌥");
    }
    if (this.modKey) {
      if (isMac) {
        modifiers.push("⌘");
      } else {
        modifiers.push("⌃");
      }
    }
    return [...modifiers, keyCodes[this.code]].join("");
  }

  toElectronAccelerator(): string {
    const modifiers: string[] = [];
    if (this.shiftKey) {
      modifiers.push("Shift");
    }
    if (this.altKey) {
      modifiers.push("Alt");
    }
    if (this.modKey) {
      modifiers.push("CommandOrControl");
    }

    return [...modifiers, keyCodes[this.code]].join("+");
  }

  matches(event: KeyboardEvent): boolean {
    return (
      event.code === this.code &&
      event.shiftKey === this.shiftKey &&
      event.altKey === this.altKey &&
      (event.metaKey || event.ctrlKey) === this.modKey
    );
  }
}
