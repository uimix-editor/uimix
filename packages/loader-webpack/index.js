const { compile } = require("@macaron-elements/compiler");

module.exports = function (source) {
  return compile(source);
};
module.exports.default = module.exports;
