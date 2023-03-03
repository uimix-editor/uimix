import { ForeignComponentRef } from "@uimix/node-data";
import { makeObservable, observable } from "mobx";
import type React from "react";
import type ReactDOM from "react-dom/client";
import type docgen from "react-docgen-typescript";

export interface ForeignComponent {
  path: string; // path relative to project root e.g. "src/Button.tsx"
  name: string; // export name; e.g. "Button" ("default" for default export)
  props: docgen.Props;
  component: React.ElementType;
}

export function foreignComponentKey(ref: { path: string; name: string }) {
  return `${ref.path}#${ref.name}`;
}

export class ForeignComponentManager {
  constructor(window: Window) {
    this.window = window;
    window
      // @ts-ignore
      .eval(`import("/project/virtual:components")`)
      .then(async (mod: any) => {
        this.React = mod.React;
        this.ReactDOM = mod.ReactDOM;

        const components: docgen.ComponentDoc[] = mod.components;
        for (const componentDoc of components) {
          const componentModule = await window
            // @ts-ignore
            .eval(`import("/project/${componentDoc.filePath}")`);
          const componentValue = componentModule[componentDoc.displayName];
          const component: ForeignComponent = {
            path: componentDoc.filePath,
            name: componentDoc.displayName,
            props: componentDoc.props,
            component: componentValue,
          };

          this.components.set(foreignComponentKey(component), component);
        }
      });
    makeObservable(this);
  }

  readonly window: Window;
  readonly components = observable.map<string, ForeignComponent>([], {
    deep: false,
  });
  @observable.ref React: typeof React | undefined;
  @observable.ref ReactDOM: typeof ReactDOM | undefined;

  get(ref: ForeignComponentRef): ForeignComponent | undefined {
    return this.components.get(foreignComponentKey(ref));
  }

  static instanceHolder = observable({
    instance: undefined as ForeignComponentManager | undefined,
  });

  static init(window: Window) {
    ForeignComponentManager.instanceHolder.instance =
      new ForeignComponentManager(window);
  }

  static get global(): ForeignComponentManager | undefined {
    return ForeignComponentManager.instanceHolder.instance;
  }
}
