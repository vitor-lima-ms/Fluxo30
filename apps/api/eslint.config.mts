import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    extends: [js.configs.recommended, tseslint.configs.recommended],
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: { globals: globals.node },
    rules: {
      'sort-imports': [
        'error',
        {
          allowSeparatedGroups: false,
          ignoreCase: true,
          ignoreDeclarationSort: false,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'single', 'multiple', 'all'],
        },
      ],
      'sort-keys': [
        'error',
        'asc',
        {
          allowLineSeparatedGroups: false,
          caseSensitive: false,
          ignoreComputedKeys: false,
          minKeys: 2,
          natural: true,
        },
      ],
    },
  },
]);
