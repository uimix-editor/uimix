import { reaction, runInAction } from "mobx";
import { describe, expect, it } from "vitest";
import * as Y from "yjs";
import { ObservableYMap } from "./ObservableYMap";

describe(ObservableYMap.name, () => {
  it("should work", async () => {
    const ydoc = new Y.Doc();

    const ymap = ydoc.getMap<string>("map");
    const map = ObservableYMap.get(ymap);

    let entries: [string, string][] = [];

    reaction(
      () => [...map],
      (e) => {
        entries = e;
      }
    );

    runInAction(() => {
      map.set("foo", "bar");
    });

    expect(entries).toEqual([["foo", "bar"]]);
  });
});
