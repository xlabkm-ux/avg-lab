import typescriptEslint from 'typescript-eslint';
import unicornPlugin from 'eslint-plugin-unicorn';

export default [
  {
    ignores: [
      "node_modules/**",
      ".turbo/**",
      "**/dist/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "artifacts/**",
      "**/vite.config.ts",
      "**/vitest.config.ts"
    ]
  },
  // JavaScript files
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
  },
  // TypeScript files
  ...typescriptEslint.config(
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: [
        typescriptEslint.configs.recommended,
      ],
      plugins: {
        unicorn: unicornPlugin,
      },
      rules: {
        // TypeScript strictness
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': ['error', { 
          'argsIgnorePattern': '^_',
          'varsIgnorePattern': '^_'
        }],
        '@typescript-eslint/no-non-null-assertion': 'warn',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-var-requires': 'warn',
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        
        // Unicorn rules for better code quality
        'unicorn/no-useless-undefined': 'error',
        'unicorn/prefer-includes': 'error',
        'unicorn/prefer-string-starts-ends-with': 'error',
        'unicorn/prefer-array-find': 'error',
        'unicorn/prefer-object-from-entries': 'error',
        'unicorn/prefer-ternary': 'error',
      }
    }
  )
];
