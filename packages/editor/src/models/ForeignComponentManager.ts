import { ForeignComponentRef } from "@uimix/node-data";
import { makeObservable, observable } from "mobx";
import type React from "react";
import type ReactDOM from "react-dom/client";

export type Type =
  | {
      type: "string";
    }
  | {
      type: "boolean";
    }
  | {
      type: "enum";
      values: string[];
    };

export interface Prop {
  name: string;
  type: Type;
}

export interface ForeignComponent {
  path: string; // path relative to project root e.g. "src/Button.tsx"
  name: string; // export name; e.g. "Button" ("default" for default export)
  props: Prop[];
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
      // TODO: make source URL configurable
      .eval(`import("http://localhost:5175/src/uimix-components.tsx")`)
      .then(
        async (mod: {
          React: typeof React;
          ReactDOM: typeof ReactDOM;
          components: ForeignComponent[];
        }) => {
          this.React = mod.React;
          this.ReactDOM = mod.ReactDOM;
          for (const component of mod.components) {
            this.components.set(foreignComponentKey(component), component);
          }
        }
      );
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
