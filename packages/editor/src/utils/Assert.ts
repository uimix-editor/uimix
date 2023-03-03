export function assertNonNull<T>(value: T | null | undefined): T {
  if (value == null) {
    throw new Error("unexpected null or undefined");
  }
  return value;
}
