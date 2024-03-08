module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: { project: ["./tsconfig.json"] },
  plugins: ["@typescript-eslint"],
  ignorePatterns: ["**/*.spec.ts", "**/*.test.ts", "**/*.js"],
  rules: {
    "@typescript-eslint/no-unsafe-enum-comparison": "off",
  },
};
