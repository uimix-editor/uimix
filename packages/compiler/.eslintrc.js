module.exports = {
  extends: "../paintkit/.eslintrc.cjs",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
};
