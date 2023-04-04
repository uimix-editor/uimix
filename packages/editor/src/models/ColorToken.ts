import * as Y from "yjs";
import { Color } from "@uimix/foundation/src/utils/Color";
import { ObservableYMap } from "@uimix/foundation/src/utils/ObservableYMap";
import { getOrCreate } from "@uimix/foundation/src/utils/Collection";
import { generateID } from "@uimix/foundation/src/utils/ID";
import { Project } from "./Project";

export class ColorToken {
  constructor(project: Project, id: string) {
    this.id = id;
    this.project = project;
  }

  readonly id: string;
  readonly project: Project;

  get data(): ObservableYMap<unknown> | undefined {
    return ObservableYMap.get(this.project.colorTokens.data.get(this.id));
  }

  get dataForWrite(): ObservableYMap<unknown> {
    return ObservableYMap.get(
      getOrCreate(this.project.colorTokens.data, this.id, () => new Y.Map())
    );
  }

  get name(): string | undefined {
    return this.data?.get("name") as string | undefined;
  }

  set name(value: string | undefined) {
    if (value === undefined) {
      this.data?.delete("name");
    } else {
      this.dataForWrite.set("name", value);
    }
  }

  get value(): Color | undefined {
    const hex = this.data?.get("value") as string | undefined;
    if (!hex) {
      return undefined;
    }
    return Color.from(hex);
  }

  set value(value: Color | undefined) {
    if (value === undefined) {
      this.data?.delete("value");
    } else {
      this.dataForWrite.set("value", value.toHex());
    }
  }

  get index(): number {
    return (this.data?.get("index") as number | undefined) ?? 0;
  }

  set index(value: number) {
    this.dataForWrite.set("index", value);
  }
}

export class ColorTokenList {
  constructor(project: Project) {
    this.project = project;
  }

  readonly project: Project;

  get data(): ObservableYMap<Y.Map<unknown>> {
    return ObservableYMap.get(this.project.doc.getMap("colors"));
  }

  get(id: string): ColorToken | undefined {
    if (!this.data.has(id)) {
      return undefined;
    }
    return new ColorToken(this.project, id);
  }

  resolve(id: string): string {
    return this.get(id)?.value?.toHex() ?? "transparent";
  }

  delete(id: string) {
    this.data.delete(id);
  }

  get all(): ColorToken[] {
    return [...this.data.keys()]
      .map((id) => new ColorToken(this.project, id))
      .sort((a, b) => a.index - b.index);
  }

  add(): ColorToken {
    const id = generateID();

    const token = new ColorToken(this.project, id);
    token.index = this.all.length;
    token.name = "New Color";
    token.value = Color.black;
    return token;
  }
}
