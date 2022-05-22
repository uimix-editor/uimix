export interface ComponentMetadata {
  /**
   * The name of the component.
   */
  name: string;

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
