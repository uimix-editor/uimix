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
   * The default slot is included as `""`.
   */
  slots: string[];
}
