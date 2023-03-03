// https://github.com/cschen1205/js-redblacktree
//
// MIT License
//
// Copyright (c) 2017 Chen Caishun
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { describe, it, expect } from "vitest";
import { RBTree } from "./RBTree";

describe("Red Black Tree", () => {
  describe("without customized comparer", () => {
    it("should store two values at this point", () => {
      const bst = new RBTree<number, number>();

      bst.set(2, 2.4);
      bst.set(4, 3.2);
      bst.set(5, 3.4);
      bst.set(6, 3.4);
      expect(bst.size).to.equal(4);
      expect(bst.get(2)).to.equal(2.4);
      expect(bst.get(4)).to.equal(3.2);
      expect(bst.has(2)).to.equal(true);
      expect(bst.has(4)).to.equal(true);
      expect(bst.get(3)).to.equal(undefined);
      expect(bst.get(6)).to.equal(3.4);

      expect([...bst]).toEqual([
        [2, 2.4],
        [4, 3.2],
        [5, 3.4],
        [6, 3.4],
      ]);
    });

    it("should overwrite old value when put using same key", () => {
      const bst = new RBTree<number, number>();

      bst.set(2, 2.4);
      bst.set(4, 3.2);
      bst.set(5, 3.4);
      bst.set(6, 3.4);
      bst.set(6, 5.4);
      expect(bst.min()?.[0]).to.equal(2);
      expect(bst.max()?.[0]).to.equal(6);
      expect(bst.size).to.equal(4);
      expect(bst.has(6));
      expect(bst.get(6)).to.equal(5.4);

      const keys = [...bst.keys()];
      for (let i = 1; i < keys.length; ++i) {
        expect(keys[i - 1]).to.below(keys[i]);
      }
    });

    it("should delete correctly", () => {
      const bst = new RBTree<number, number>();

      for (let i = 0; i < 100; i += 2) {
        bst.set(i, i);
      }
      for (let i = 1; i < 100; i += 2) {
        bst.set(i, i);
      }

      let count = 100;
      expect(bst.size).to.equal(count);
      for (let i = 0; i < 100; i += 5) {
        bst.delete(i);
        count--;
        expect(bst.size).to.equal(count);
      }
    });
  });

  describe("with customized comparer", () => {
    it("should store two values at this point", () => {
      const bst = new RBTree<number, number>((a1, a2) => {
        return a2 - a1; // sort descendingly instead of default ascendingly
      });

      bst.set(2, 2.4);
      bst.set(4, 3.2);
      bst.set(5, 3.4);
      bst.set(6, 3.4);
      expect(bst.min()?.[0]).to.equal(6);
      expect(bst.max()?.[0]).to.equal(2);
      expect(bst.size).to.equal(4);
      expect(bst.get(2)).to.equal(2.4);
      expect(bst.get(4)).to.equal(3.2);
      expect(bst.has(2)).to.equal(true);
      expect(bst.has(4)).to.equal(true);
      expect(bst.get(3)).to.equal(undefined);
      expect(bst.get(6)).to.equal(3.4);
    });

    it("should overwrite old value when put using same key", () => {
      const bst = new RBTree<number, number>((a1, a2) => {
        return a2 - a1; // sort descendingly instead of default ascendingly
      });

      bst.set(2, 2.4);
      bst.set(4, 3.2);
      bst.set(5, 3.4);
      bst.set(6, 3.4);
      bst.set(6, 5.4);
      expect(bst.size).to.equal(4);
      expect(bst.has(6));
      expect(bst.get(6)).to.equal(5.4);

      const keys = [...bst.keys()];
      for (let i = 1; i < keys.length; ++i) {
        expect(keys[i - 1]).to.above(keys[i]);
      }
    });

    it("should delete correctly", () => {
      const bst = new RBTree<number, number>((a1, a2) => {
        return a2 - a1; // sort descendingly instead of default ascendingly
      });

      for (let i = 0; i < 100; i += 2) {
        bst.set(i, i);
      }
      for (let i = 1; i < 100; i += 2) {
        bst.set(i, i);
      }

      console.log(bst.print());

      let count = 100;
      expect(bst.size).to.equal(count);
      for (let i = 0; i < 100; i += 5) {
        bst.delete(i);
        count--;
        expect(bst.size).to.equal(count);
      }
    });

    it("should retrieve next element", () => {
      const bst = new RBTree<number, number>();
      for (let i = 0; i < 100; ++i) {
        bst.set(i, i);
      }

      for (let i = 0; i < 100; ++i) {
        const next = bst.next(i)?.[0];
        if (i === 99) {
          expect(next).to.equal(undefined);
        } else {
          expect(next).to.equal(i + 1);
        }
      }
    });

    it("should retrieve prev element", () => {
      const bst = new RBTree<number, number>();
      for (let i = 0; i < 100; ++i) {
        bst.set(i, i);
      }

      for (let i = 0; i < 100; ++i) {
        const prev = bst.prev(i)?.[1];
        if (i === 0) {
          expect(prev).to.equal(undefined);
        } else {
          expect(prev).to.equal(i - 1);
        }
      }
    });
  });
});
