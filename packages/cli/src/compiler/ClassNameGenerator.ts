import { Project } from "@uimix/model/src/models";
import {
  IncrementalUniqueNameGenerator,
  generateUpperJSIdentifier,
} from "@uimix/foundation/src/utils/Name";

export class ClassNameGenerator {
  constructor(project: Project) {
    this.project = project;

    for (const page of project.pages.all) {
      const namegen = new IncrementalUniqueNameGenerator();

      const pageID = page.id.slice(0, 6);

      for (const component of page.components) {
        const componentName = namegen.generate(
          generateUpperJSIdentifier(component.name)
        );

        const refIDs = component.refIDs;
        for (const [nodeID, refID] of refIDs) {
          const className = `${componentName}${pageID}__${refID}`;
          this.uniqueNames.set(nodeID, className);
        }

        this.uniqueNames.set(
          component.rootNode.id,
          `${componentName}${pageID}`
        );
      }
    }
  }

  getUniqueName(nodeID: string): string {
    const className = this.uniqueNames.get(nodeID);
    if (!className) {
      throw new Error(`No class name for node ${nodeID}`);
    }
    return className;
  }

  get(nodePath: string[]) {
    const readableIDPath = nodePath.map((id) => this.getUniqueName(id));
    return `uimix-${readableIDPath.join("-")}`;
  }

  project: Project;
  uniqueNames = new Map<string /* node id */, string>();
}
