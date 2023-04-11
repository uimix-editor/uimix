interface AbstractType<T> {
  default: T;
}

interface StringType extends AbstractType<string> {
  type: "string";
}

interface BooleanType extends AbstractType<boolean> {
  type: "boolean";
}

interface EnumType<T extends readonly string[]>
  extends AbstractType<T[number]> {
  type: "enum";
}

interface ObjectType<T extends Record<string, unknown>>
  extends AbstractType<T> {
  type: "object";
  props: { [K in keyof T]: AbstractType<T[K]> };
}

export function string(): StringType {
  return {
    type: "string",
    default: "",
  };
}

export function boolean(): BooleanType {
  return {
    type: "boolean",
    default: false,
  };
}

export function enum_<U extends string, T extends Readonly<[U, ...U[]]>>(
  values: T
): EnumType<T> {
  return {
    type: "enum",
    default: values[0],
  };
}

export function object<T extends Record<string, unknown>>(props: {
  [K in keyof T]: AbstractType<T[K]>;
}): ObjectType<T> {
  const defaultValue = Object.fromEntries(
    Object.entries(props).map(([key, value]) => [
      key,
      (value as AbstractType<unknown>).default,
    ])
  );

  return {
    type: "object",
    props,
    default: defaultValue as T,
  };
}

export type Infer<T> = T extends AbstractType<infer U> ? U : never;

const user = object({
  name: string(),
  premium: boolean(),
  role: enum_(["admin", "user"]),
});

export type T = Infer<typeof user>;
//          ^?
