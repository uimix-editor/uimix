import { encode } from "url-safe-base64";

export async function getURLSafeBase64Hash(
  buffer: ArrayBuffer
): Promise<string> {
  // get hash of blob
  const hashData = await crypto.subtle.digest("SHA-256", buffer);
  return encode(Buffer.from(hashData).toString("base64"));
}
