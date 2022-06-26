import { describe, it, expect } from "vitest";
import { parseMaxWidth } from "./parseMaxWidth";

describe(parseMaxWidth.name, () => {
  it("should return NaN for empty string", () => {
    expect(parseMaxWidth("")).toBeNaN();
  });

  it("should return NaN for string without max-width", () => {
    expect(parseMaxWidth("foo")).toBeNaN();
  });

  it("should return number for string with max-width", () => {
    expect(parseMaxWidth("(max-width: 100px)")).toBe(100);
  });
});
