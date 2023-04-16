import * as Y from "yjs";
import { Color } from "@uimix/foundation/src/utils/Color";
import { ObservableYMap } from "@uimix/foundation/src/utils/ObservableYMap";
import { generateID } from "@uimix/foundation/src/utils/ID";
import { ColorToken as ColorTokenJSON } from "../data/v1";
import { Project } from "./Project";
import { Page } from "./Page";
import { ObjectData } from "./ObjectData";
import * as CodeAsset from "@uimix/code-asset-types";
import { observable } from "mobx";

export class CodeColorToken {
  constructor(token: CodeAsset.ColorToken) {
    this.id = token.id;
    this.name = token.name;
    this.value = Color.from(token.value) ?? Color.black;
  }

  readonly id: string;
  readonly name: string;
  readonly value: Color;

  get type(): "code" {
    return "code";
  }
}

export class ColorToken {
  constructor(project: Project, id: string) {
    this.id = id;
    this.project = project;
    this.data = new ObjectData<ColorTokenJSON>(
      this.id,
      this.project.colorTokens.data
    );
  }

  readonly id: string;
  readonly project: Project;
  readonly data: ObjectData<ColorTokenJSON>;

  get type(): "normal" {
    return "normal";
  }

  get name(): string | undefined {
    return this.data.get("name");
  }

  set name(name: string | undefined) {
    this.data.set({ name });
  }

  get value(): Color | undefined {
    const value = this.data.get("value");
    return value ? Color.from(value) : undefined;
  }

  set value(value: Color | undefined) {
    this.data.set({ value: value?.toHex() });
  }

  get index(): number {
    return this.data.get("index") ?? 0;
  }

  set index(index: number) {
    this.data.set({ index });
  }

  get pageID(): string | undefined {
    return this.data.get("page");
  }

  set pageID(value: string | undefined) {
    this.data.set({ page: value });
  }
}

export class ColorTokenMap {
  constructor(project: Project) {
    this.project = project;
  }

  readonly project: Project;

  get data(): ObservableYMap<Y.Map<ColorTokenJSON[keyof ColorTokenJSON]>> {
    return ObservableYMap.get(this.project.data.colors);
  }

  get(id: string): ColorToken | CodeColorToken | undefined {
    const codeToken = this.codeColorTokens.get(id);
    if (codeToken) {
      return codeToken;
    }
    if (this.data.has(id)) {
      return new ColorToken(this.project, id);
    }
  }

  resolve(id: string): string {
    return this.get(id)?.value?.toHex() ?? "transparent";
  }

  delete(id: string) {
    this.data.delete(id);
  }

  get all(): ColorToken[] {
    return [...this.data.keys()].map((id) => new ColorToken(this.project, id));
  }

  readonly codeColorTokens = observable.map<string, CodeColorToken>();
}

export class ColorTokenList {
  constructor(page: Page) {
    this.page = page;
    this.project = page.project;
  }

  readonly page: Page;
  readonly project: Project;

  get all(): ColorToken[] {
    return this.project.colorTokens.all.filter(
      (token) => token.pageID === this.page.id
    );
  }

  add(): ColorToken {
    const id = generateID();

    const token = new ColorToken(this.project, id);
    token.index = this.all.length;
    token.name = "New Color";
    token.value = Color.black;
    token.pageID = this.page.id;
    return token;
  }
}
