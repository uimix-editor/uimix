export function assertNonNull<T>(
  value: T | null | undefined,
  message: string = "Expected value to be non-null"
): T {
  if (value == null) {
    throw new Error(message);
  }
  return value;
}
