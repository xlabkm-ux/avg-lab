export default [
  {
    ignores: [
      "node_modules/**",
      ".turbo/**",
      "dist/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "artifacts/**"
    ]
  },
  {
    files: ["*.js", "*.mjs", "*.cjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    },
    rules: {
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "no-undef": "error"
    }
  }
];
