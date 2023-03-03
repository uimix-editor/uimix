module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    //"plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  parserOptions: {
    project: __dirname + "/tsconfig.json",
  },
  rules: {
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-this-alias": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/restrict-plus-operands": "off",
    "@typescript-eslint/no-misused-promises": "off",
  },
};
