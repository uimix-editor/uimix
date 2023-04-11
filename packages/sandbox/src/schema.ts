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

function buildString(): StringType {
  return {
    type: "string",
    default: "",
  };
}

function buildBoolean(): BooleanType {
  return {
    type: "boolean",
    default: false,
  };
}

function buildEnum<U extends string, T extends Readonly<[U, ...U[]]>>(
  values: T
): EnumType<T> {
  return {
    type: "enum",
    default: values[0],
  };
}

function buildObject<T extends Record<string, unknown>>(props: {
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

export const builders = {
  string: buildString,
  boolean: buildBoolean,
  enum: buildEnum,
  object: buildObject,
};

export type Infer<T> = T extends AbstractType<infer U> ? U : never;

const user = builders.object({
  name: builders.string(),
  premium: builders.boolean(),
  role: builders.enum(["admin", "user"]),
});

type T = Infer<typeof user>;
//   ^?
