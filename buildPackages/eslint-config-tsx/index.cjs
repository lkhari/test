module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: { project: ["./tsconfig.json"] },
  plugins: ["@typescript-eslint", "react", "react-hooks", "react-refresh"],
  ignorePatterns: ["**/*.spec.ts", "**/*.test.ts"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-misused-promises": [
      2,
      {
        checksVoidReturn: {
          attributes: false,
        },
      },
    ],
    "@typescript-eslint/no-floating-promises": "off",
  },
  root: true,
  settings: {
    react: {
      version: "detect",
    },
  },
};
