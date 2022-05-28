import { compile } from "@macaron-app/compiler";

const fileRegex = /\.macaron$/;

export default function myPlugin() {
  return {
    name: "macaron-loader",

    transform(src, id) {
      if (fileRegex.test(id)) {
        return {
          code: compile(src),
          map: null, // provide source map if available
        };
      }
    },
  };
}
