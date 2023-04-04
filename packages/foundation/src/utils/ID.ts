// @ts-ignore
import anyBase from "any-base";
import { crypto } from "./Hash";

const base58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

// eslint-disable-next-line
const decimalToBase58: (dec: string) => string = anyBase(anyBase.DEC, base58);

export function generateID(): string {
  // ULID (https://github.com/ulid/spec) encoded in base58

  const ms = BigInt(Date.now());

  const data = new Uint8Array(16);
  const dataBytes = new DataView(data.buffer);

  dataBytes.setUint32(0, Number(ms >> 16n));
  dataBytes.setUint16(4, Number(ms & 0xffffn));

  crypto.getRandomValues(new Uint8Array(data.buffer, 6, 10));

  const value = (dataBytes.getBigUint64(0) << 64n) + dataBytes.getBigUint64(8);

  //console.log(Date.now().toString(16), value.toString(16));
  const ret = decimalToBase58(value.toString()).padStart(22, base58[0]);
  //console.log(ret);
  return ret;
}
