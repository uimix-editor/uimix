import { encode } from "url-safe-base64";
import { Buffer } from "buffer";
import { sha256 } from "js-sha256";

export function getURLSafeBase64Hash(
  data: string | Uint8Array | ArrayBuffer
): string {
  const hash = sha256.arrayBuffer(data);
  return encode(Buffer.from(hash).toString("base64"));
}
