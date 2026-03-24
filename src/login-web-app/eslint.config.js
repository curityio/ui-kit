import globals from 'globals';
import js from '@eslint/js';
import react from '@eslint-react/eslint-plugin';
import tseslint from 'typescript-eslint';
import * as reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      // If 'strict' becomes annoying we can consider using 'recommended' instead
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      // If all-in-one becomes annoying we can consider using individual rule sets (available as separate packages)
      react.configs['recommended-typescript'],
      // If 'eslint-plugin-react-hooks' is upgraded to 6.0+, this should be updated to 'reactHooks.configs.recommended'
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      // Allows usage of type-checked rules: https://typescript-eslint.io/getting-started/typed-linting
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreVoidReturningFunctions: true }],
    },
  },
  {
    files: ['**/*.spec.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  }
);
