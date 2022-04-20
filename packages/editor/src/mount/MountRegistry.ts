import { Element } from "../models/Element";
import { Text } from "../models/Text";
import { ElementMount } from "./ElementMount";
import { TextMount } from "./TextMount";
import { WeakMultiMap } from "@seanchas116/paintkit/dist/util/WeakMultiMap";

export class MountRegistry {
  readonly elementMounts = new WeakMultiMap<Element, ElementMount>();
  readonly textMounts = new WeakMultiMap<Text, TextMount>();
}
