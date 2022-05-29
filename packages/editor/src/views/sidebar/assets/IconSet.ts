import { IconifyInfo, IconifyJSON } from "@iconify/types";

export interface IconPrefix {
  id: string;
  title: string;
}

export interface IconItem {
  id: string;
  body: string;
}

export class IconSet {
  constructor(metadata: IconifyJSON) {
    this.info = metadata.info;

    for (const [id, title] of Object.entries(metadata.prefixes ?? {})) {
      this.prefixes.set(id, { id, title });
    }

    for (const [id, value] of Object.entries(metadata.icons)) {
      this.items.set(id, { id, ...value });
    }
  }

  info: IconifyInfo | undefined;

  prefixes = new Map<string, IconPrefix>();
  items = new Map<string, IconItem>();
}
