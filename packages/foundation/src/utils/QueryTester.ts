export class QueryTester {
  constructor(query: string) {
    this.tokens = query.toLocaleLowerCase().trim().split(/\s+/);
  }

  readonly tokens: string[];

  test(value: string): boolean {
    if (this.tokens.length === 0) {
      return true;
    }

    const lowerName = value.toLocaleLowerCase();
    return this.tokens.every((token) => lowerName.includes(token));
  }
}
