import { describe, it, expect } from "vitest";
import { Color } from "./Color";

describe(Color.name, () => {
  describe(Color.from.name, () => {
    it("should create a color from a hex-like string", () => {
      expect(Color.from("2")?.toHex8()).toEqual("#222222FF");
      expect(Color.from("34")?.toHex8()).toEqual("#343434FF");
      expect(Color.from("123")?.toHex8()).toEqual("#112233FF");
      expect(Color.from("123456")?.toHex8()).toEqual("#123456FF");
      expect(Color.from("12345678")?.toHex8()).toEqual("#12345678");
      expect(Color.from("#2")?.toHex8()).toEqual("#222222FF");
      expect(Color.from("#34")?.toHex8()).toEqual("#343434FF");
      expect(Color.from("#123")?.toHex8()).toEqual("#112233FF");
      expect(Color.from("#123456")?.toHex8()).toEqual("#123456FF");
      expect(Color.from("#12345678")?.toHex8()).toEqual("#12345678");
    });
  });
});
