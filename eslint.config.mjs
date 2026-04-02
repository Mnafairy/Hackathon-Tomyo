import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import unicorn from 'eslint-plugin-unicorn';
import promise from 'eslint-plugin-promise';
import spellcheck from 'eslint-plugin-spellcheck';
import * as jsoncParser from 'jsonc-eslint-parser';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),

  // JSX/TSX files — PascalCase filename, arrow-function components
  {
    files: ['**/*.jsx', '**/*.tsx'],
    ignores: ['components/ui/**'],
    plugins: { unicorn },
    rules: {
      'unicorn/prefer-module': 'off',
      'unicorn/filename-case': ['error', { case: 'pascalCase' }],
      'react/function-component-definition': [
        'error',
        { namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' },
      ],
    },
  },

  // Next.js special files + plain JS/TS — kebabCase filename
  {
    files: [
      '**/*.js',
      '**/*.ts',
      '**/pages/**/*.tsx',
      '**/pages/**/*.jsx',
      '**/app/**/page.tsx',
      '**/app/**/layout.tsx',
      '**/app/**/template.tsx',
      '**/app/**/loading.tsx',
      '**/app/**/error.tsx',
      '**/app/**/global-error.tsx',
      '**/app/**/not-found.tsx',
      'mdx-components.tsx',
    ],
    plugins: { unicorn },
    rules: {
      'unicorn/prefer-module': 'off',
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
    },
  },

  // React hooks — camelCase filename
  {
    files: ['**/use[A-Z]*.js', '**/use[A-Z]*.ts'],
    plugins: { unicorn },
    rules: {
      'unicorn/prefer-module': 'off',
      'unicorn/filename-case': ['error', { case: 'camelCase' }],
    },
  },

  // Native files — disable filename-case
  {
    files: ['**/*.native.tsx'],
    plugins: { unicorn },
    rules: {
      'unicorn/filename-case': 'off',
    },
  },

  // Test/spec files — disable filename-case
  {
    files: ['**/*.cy.ts', '**/*.cy.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
    plugins: { unicorn },
    rules: {
      'unicorn/filename-case': 'off',
    },
  },

  // All JS/TS/JSX/TSX — camelCase properties
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    ignores: ['components/ui/**'],
    plugins: { promise },
    rules: {
      camelcase: ['warn', { properties: 'always' }],
    },
  },

  // TypeScript files — strict rules
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['components/ui/**'],
    plugins: { spellcheck },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { vars: 'all', args: 'after-used', argsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      'no-magic-numbers': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'max-lines': 'off',
      'max-nested-callbacks': ['error', 3],
      'max-depth': ['error', 4],
    },
  },

  // JSON files
  {
    files: ['**/*.json'],
    languageOptions: {
      parser: jsoncParser,
    },
    rules: {},
  },
]);

export default eslintConfig;
