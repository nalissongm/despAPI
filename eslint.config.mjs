// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    // Global ignores
    ignores: ['dist', 'node_modules', 'eslint.config.mjs'],
  },
  // Base config for all files
  eslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    // TypeScript specific configuration
    files: ['**/*.ts'],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      "prettier/prettier": ["error", { "endOfLine": "auto" }],
    },
  },
  {
    // Jest/test specific configuration
    files: ['**/*.spec.ts', '**/*.e2e-spec.ts'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  {
    // Node environment globals for all .ts files
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  }
);