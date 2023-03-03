import { isElement } from "lodash-es";

const inputTypes = [
  "text",
  "password",
  "number",
  "email",
  "url",
  "search",
  "date",
  "datetime",
  "datetime-local",
  "time",
  "month",
  "week",
];

export function isTextInput(value: EventTarget | null | undefined): boolean {
  if (!isElement(value)) {
    return false;
  }
  const elem = value as HTMLElement | SVGSVGElement;
  if ("contentEditable" in elem && elem.isContentEditable) {
    return true;
  }
  if (elem.tagName === "TEXTAREA") return true;
  if (elem.tagName === "INPUT") {
    return inputTypes.includes((elem as HTMLInputElement).type);
  }

  if (elem.shadowRoot) {
    return isTextInput(elem.shadowRoot.activeElement);
  }

  return false;
}
