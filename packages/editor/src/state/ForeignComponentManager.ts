import { ForeignComponentRef } from "@uimix/model/src/data/v1";
import { action, observable, reaction } from "mobx";
import type React from "react";
import type ReactDOM from "react-dom/client";
import { projectState } from "./ProjectState";
import * as CodeAsset from "@uimix/code-asset-types";
import { Buffer } from "buffer";
import { CodeColorToken } from "@uimix/model/src/models";

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
        // unload
        for (const link of this.loadedLinks) {
          link.remove();
        }
        this.components.clear();
        projectState.project.colorTokens.codeColorTokens.clear();

        for (const url of urls) {
          if (url.endsWith(".css") || url.startsWith("data:text/css")) {
            const link = window.document.createElement("link");
            link.rel = "stylesheet";
            link.href = url;
            window.document.head.appendChild(link);
            this.loadedLinks.push(link);
          } else {
            // eslint-disable-next-line
            void window
              // @ts-ignore
              .eval(`import(${JSON.stringify(url)})`)
              .then(
                action(
                  (mod: {
                    React: typeof React;
                    ReactDOM: typeof ReactDOM;
                    components: CodeAsset.Component[];
                    tokens: CodeAsset.DesignToken[];
                  }) => {
                    for (const component of mod.components) {
                      this.components.set(foreignComponentKey(component), {
                        ...component,
                        key: Math.random(),
                      });
                    }

                    for (const token of mod.tokens) {
                      if (token.type === "color") {
                        projectState.project.colorTokens.codeColorTokens.set(
                          token.id,
                          new CodeColorToken(token)
                        );
                      }
                    }
                  }
                )
              );
          }
        }
      }),
      { fireImmediately: true }
    );
  }

  readonly window: Window;
  readonly components = observable.map<
    string,
    CodeAsset.Component & { key: number }
  >([], {
    deep: false,
  });
  readonly loadedLinks: HTMLLinkElement[] = [];

  get(
    ref: ForeignComponentRef
  ): (CodeAsset.Component & { key: number }) | undefined {
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
