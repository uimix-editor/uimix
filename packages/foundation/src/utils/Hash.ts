import { encode } from "url-safe-base64";
import { Buffer } from "buffer";
import createHash, { TypedArray } from "create-hash";

type Data = string | Buffer | TypedArray | DataView;

export function sha256(data: Data): Buffer {
  const hash = createHash("sha256");
  hash.update(data);
  return hash.digest();
}

export function getURLSafeBase64Hash(data: Data): string {
  const hash = sha256(data);
  return encode(Buffer.from(hash).toString("base64"));
}
