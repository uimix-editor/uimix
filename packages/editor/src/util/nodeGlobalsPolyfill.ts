// @ts-ignore
import { Buffer } from "buffer";
// @ts-ignore
import process from "rollup-plugin-node-polyfills/polyfills/process-es6";

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
window.Buffer = Buffer;

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
window.process = process;
