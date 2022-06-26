import { describe, it, expect } from "vitest";
import { parseMaxWidth } from "./parseMaxWidth";

describe(parseMaxWidth.name, () => {
  it("should return Infinity for empty string", () => {
    expect(parseMaxWidth("")).toBe(Infinity);
  });

  it("should return Infinity for string without max-width", () => {
    expect(parseMaxWidth("foo")).toBe(Infinity);
  });

  it("should return number for string with max-width", () => {
    expect(parseMaxWidth("(max-width: 100px)")).toBe(100);
  });
});
