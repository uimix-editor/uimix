import { ForeignComponentRef } from "@uimix/model/src/data/v1";
import { action, observable, reaction } from "mobx";
import type React from "react";
import type ReactDOM from "react-dom/client";
import { projectState } from "./ProjectState";
import { ForeignComponent } from "@uimix/asset-types";
import { Buffer } from "buffer";

export function foreignComponentKey(ref: { path: string; name: string }) {
  return `${ref.path}#${ref.name}`;
}

export class ForeignComponentManager {
  constructor(window: Window) {
    this.window = window;

    reaction(
      () => [
        ...projectState.project.componentURLs.toArray(),
        ...(projectState.project.localCodeAssets
          ? [
              `data:text/css;base64,${Buffer.from(
                projectState.project.localCodeAssets.css
              ).toString("base64")}`,
              `data:text/javascript;base64,${Buffer.from(
                projectState.project.localCodeAssets.js
              ).toString("base64")}`,
            ]
          : []),
      ],
      action((urls) => {
        console.log("update", urls);
        // TODO: unload
        for (const url of urls) {
          if (url.endsWith(".css") || url.startsWith("data:text/css")) {
            window.document.head.insertAdjacentHTML(
              "beforeend",
              `<link rel="stylesheet" href=${JSON.stringify(url)}>`
            );
          } else {
            // eslint-disable-next-line
            void window
              // @ts-ignore
              .eval(`import(${JSON.stringify(url)})`)
              .then(
                async (mod: {
                  React: typeof React;
                  ReactDOM: typeof ReactDOM;
                  components: ForeignComponent[];
                }) => {
                  for (const component of mod.components) {
                    this.components.set(
                      foreignComponentKey(component),
                      component
                    );
                  }
                }
              );
          }
        }
      }),
      { fireImmediately: true }
    );
  }

  readonly window: Window;
  readonly components = observable.map<string, ForeignComponent>([], {
    deep: false,
  });

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
