import path from "path";
import fs from "fs";
import url from "url";
import { describe, it, expect, beforeEach } from "vitest";
import { parseDocument, stringifyDocument } from "../fileFormat/document";
import { Document } from "./Document";

const __filename = url.fileURLToPath(import.meta.url);
const fixtureFilePath = path.resolve(
  __filename,
  "../../../../test-project/test.macaron"
);
const data = fs.readFileSync(fixtureFilePath, "utf-8");

let doc: Document;

beforeEach(() => {
  doc = parseDocument(data);
});

describe(Document.name, () => {
  describe(Document.prototype.renameTagNameUsages.name, () => {
    it("should rename tag name usages", () => {
      doc.renameTagNameUsages("user-card", "user-card-new");
      const saved = stringifyDocument(doc);
      expect(saved).toContain("user-card-new");
      expect(saved).toMatchSnapshot();
    });
  });

  describe(Document.prototype.renameCSSVariableUsages.name, () => {
    it("should rename CSS variable usages", () => {
      doc.renameCSSVariableUsages(
        "--user-card-name-color",
        "--user-card-name-color-new"
      );

      const saved = stringifyDocument(doc);
      expect(saved).toContain("--user-card-name-color-new");
      expect(saved).toMatchSnapshot();
    });
  });
});
