import { describe, it, expect } from "vitest";
import {
  generateJSIdentifier,
  getIncrementalUniqueName,
  incrementAlphanumeric,
} from "./Name";

describe(incrementAlphanumeric.name, () => {
  it("add 0 if given string does not include number", () => {
    expect(incrementAlphanumeric("foobar")).toEqual("foobar1");
  });
  it("increment suffix 1 to 2", () => {
    expect(incrementAlphanumeric("foobar1")).toEqual("foobar2");
  });
  it("increment suffix numbers", () => {
    expect(incrementAlphanumeric("foobar9")).toEqual("foobar10");
    expect(incrementAlphanumeric("foobar10")).toEqual("foobar11");
    expect(incrementAlphanumeric("foobar123")).toEqual("foobar124");
    expect(incrementAlphanumeric("foobar999")).toEqual("foobar1000");
    expect(incrementAlphanumeric("foobar0999")).toEqual("foobar01000");
  });
});

describe(getIncrementalUniqueName.name, () => {
  const existings = new Set(["foo", "bar1", "bar2"]);

  it("returns non-conflicting name based on incrementing", () => {
    expect(getIncrementalUniqueName(existings, "foo")).toEqual("foo1");
    expect(getIncrementalUniqueName(existings, "bar1")).toEqual("bar3");
    expect(getIncrementalUniqueName(existings, "bar2")).toEqual("bar3");
  });
});

describe(generateJSIdentifier.name, () => {
  it("replaces non-alphanumeric characters with underscore", () => {
    expect(generateJSIdentifier("foo-bar")).toEqual("foo_bar");
    expect(generateJSIdentifier("foo-bar-baz")).toEqual("foo_bar_baz");
    expect(generateJSIdentifier("foo-あいうえお-bar-baz")).toEqual(
      "foo_______bar_baz"
    );
  });
  it("prepends underscore prefix if the first character is a number", () => {
    expect(generateJSIdentifier("1foo")).toEqual("_1foo");
    expect(generateJSIdentifier("1foo-bar")).toEqual("_1foo_bar");
  });
  it("appends underscore prefix if the name is a reserved word", () => {
    expect(generateJSIdentifier("do")).toEqual("do_");
    expect(generateJSIdentifier("if")).toEqual("if_");
  });
  it("generates a single underscore if the name is empty", () => {
    expect(generateJSIdentifier("")).toEqual("_");
  });
});
