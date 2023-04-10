export const crypto =
  globalThis.crypto ?? (await import("node:crypto")).webcrypto;
