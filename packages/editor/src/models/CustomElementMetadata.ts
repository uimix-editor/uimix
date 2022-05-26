import type * as hast from "hast";

export interface CustomElementMetadata {
  /**
   * The tag name of the component.
   */
  tagName: string;

  /**
   * The thumbnail data URL of the component.
   */
  thumbnail?: string;

  /**
   * The CSS variables used by the component.
   * (includes leading `--`)
   */
  cssVariables: string[];

  /**
   * The slots used by the component.
   */
  slots: Slot[];
}

interface Slot {
  name?: string;
  defaultHTML?: hast.Content[];
}
