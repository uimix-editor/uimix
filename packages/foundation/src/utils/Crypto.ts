// eslint-disable-next-line
export const crypto = globalThis.crypto ?? require("node:crypto").webcrypto;
