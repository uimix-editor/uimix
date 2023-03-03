export function getOrCreate<K, V>(
  map: {
    has(key: K): boolean;
    get(key: K): V | undefined;
    set(key: K, value: V): void;
  },
  key: K,
  create: () => V
): V {
  if (!map.has(key)) {
    map.set(key, create());
  }
  return map.get(key)!;
}
