export interface ComponentMetadata {
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

  // TODO: slots
}
