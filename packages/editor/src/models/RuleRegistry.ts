import { observable } from "mobx";
import { Rule } from "./Rule";

export class RuleRegistry {
  readonly rules = observable<Rule>([]);

  ruleForID(id: string): Rule | undefined {
    throw new Error("TODO");
  }
}
