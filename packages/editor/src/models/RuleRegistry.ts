import { observable } from "mobx";
import { Rule } from "./Rule";

export class RuleRegistry {
  readonly rules = observable<Rule>([]);

  ruleForID(id: string): Rule | undefined {
    // TODO: create index

    for (const rule of this.rules) {
      if (rule.selector.length === 1 && rule.selector[0].length === 1) {
        const selector = rule.selector[0][0];
        if (
          selector.type === "attribute" &&
          selector.action === "equals" &&
          selector.name === "id" &&
          selector.value === id
        ) {
          return rule;
        }
      }
    }
  }
}
