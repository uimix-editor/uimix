const { compile } = require("@macaron-app/compiler");

const fileRegex = /\.macaron$/;

function macaronPlugin() {
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

module.exports = macaronPlugin;
module.exports.default = macaronPlugin;
