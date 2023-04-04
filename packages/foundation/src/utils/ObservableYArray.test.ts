import { reaction, runInAction } from "mobx";
import { describe, expect, it } from "vitest";
import * as Y from "yjs";
import { ObservableYArray } from "./ObservableYArray";

describe(ObservableYArray.name, () => {
  it("should work", async () => {
    const ydoc = new Y.Doc();

    const ymap = ydoc.getArray<string>("map");
    const array = ObservableYArray.get(ymap);

    let entries: string[] = [];

    reaction(
      () => [...array],
      (e) => {
        entries = e;
      }
    );

    runInAction(() => {
      array.push(["foo", "bar"]);
    });

    expect(entries).toEqual(["foo", "bar"]);
  });
});
