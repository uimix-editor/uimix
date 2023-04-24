import { lowerFirst, upperFirst } from "lodash-es";

export function incrementAlphanumeric(str: string): string {
  const numMatches = /[1-9][0-9]*$/.exec(str);
  if (numMatches) {
    const numPart = numMatches[0];
    const strPart = str.slice(0, str.length - numPart.length);

    return `${strPart}${Number.parseInt(numPart) + 1}`;
  }

  return str + "1";
}

export class IncrementalUniqueNameGenerator {
  constructor(existingNames: Iterable<string> = []) {
    this.existingNames = new Set(existingNames);
  }

  generate(name: string): string {
    const generated = getIncrementalUniqueName(this.existingNames, name);
    this.existingNames.add(generated);
    return generated;
  }

  generateLowerJSIdentifier(name: string): string {
    return this.generate(generateLowerJSIdentifier(name));
  }

  generateUpperJSIdentifier(name: string): string {
    return this.generate(generateUpperJSIdentifier(name));
  }

  readonly existingNames: Set<string>;
}

export function getIncrementalUniqueName(
  existings: ReadonlySet<string>,
  name: string
): string {
  while (existings.has(name)) {
    name = incrementAlphanumeric(name);
  }
  return name;
}

export const jsReservedWords = new Set([
  "do",
  "if",
  "in",
  "for",
  "let",
  "new",
  "try",
  "var",
  "case",
  "else",
  "enum",
  "eval",
  "null",
  "this",
  "true",
  "void",
  "with",
  "await",
  "break",
  "catch",
  "class",
  "const",
  "false",
  "super",
  "throw",
  "while",
  "yield",
  "delete",
  "export",
  "import",
  "public",
  "return",
  "static",
  "switch",
  "typeof",
  "default",
  "extends",
  "finally",
  "package",
  "private",
  "continue",
  "debugger",
  "function",
  "arguments",
  "interface",
  "protected",
  "implements",
  "instanceof",
]);

export function generateJSIdentifier(name: string): string {
  if (name.length === 0) {
    return "_";
  }

  const result = name
    .replace(/[^a-zA-Z0-9_$]/g, "_")
    .replace(/^([0-9])/, "_$1");

  if (jsReservedWords.has(result)) {
    return result + "_";
  }
  return result;
}

export function generateLowerJSIdentifier(name: string): string {
  return lowerFirst(generateJSIdentifier(name));
}
export function generateUpperJSIdentifier(name: string): string {
  return upperFirst(generateJSIdentifier(name));
}

interface NodeLike {
  name?: string;
  id: string;
  children: NodeLike[];
}

/**
 * Generates human-readable ref IDs for each node in the tree.
 * @returns a map from node ID to ref ID
 */
export function generateRefIDs(rootNode: NodeLike): Map<string, string> {
  const refIDs = new Map<string, string>();
  const generatedRefIDs = new Set<string>();

  const visit = (node: NodeLike) => {
    const refID = getIncrementalUniqueName(
      generatedRefIDs,
      lowerFirst(generateJSIdentifier(node.name ?? ""))
    );
    generatedRefIDs.add(refID);
    refIDs.set(node.id, refID);

    node.children.forEach(visit);
  };

  for (const child of rootNode.children) {
    visit(child);
  }

  return refIDs;
}
