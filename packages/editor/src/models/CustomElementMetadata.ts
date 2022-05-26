import type * as hast from "hast";
import { h } from "hastscript";

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
  defaultContent?: hast.Content[];
}

export const CustomElementMetadata = {
  defaultContent(metadata: CustomElementMetadata): hast.Content[] {
    const contents: hast.Content[] = [];

    for (const slot of metadata.slots) {
      if (!slot.name) {
        contents.push(...(slot.defaultContent ?? []));
        continue;
      }
      if (!slot.defaultContent) {
        continue;
      }

      if (
        slot.defaultContent.length === 1 &&
        slot.defaultContent[0].type === "element"
      ) {
        const element = slot.defaultContent[0];
        contents.push({
          ...element,
          properties: {
            ...element.properties,
            slot: slot.name,
          },
        });
        continue;
      }

      contents.push(
        h(
          "span",
          {
            slot: slot.name,
          },
          slot.defaultContent
        )
      );
    }

    return contents;
  },
};
