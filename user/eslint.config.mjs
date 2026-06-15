import js from '@eslint/js';
import globals from 'globals';
import nextPlugin from '@next/eslint-plugin-next';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

const nextCoreWebVitalsRules = nextPlugin.configs['core-web-vitals'].rules;

export default [
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts']
  },
  js.configs.recommended,
  {
    files: ['app/**/*.{ts,tsx}', 'src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2024
      }
    },
    plugins: {
      '@next/next': nextPlugin,
      '@typescript-eslint': tsPlugin
    },
    settings: {
      next: {
        rootDir: '.'
      }
    },
    rules: {
      ...nextCoreWebVitalsRules,
      '@next/next/no-html-link-for-pages': 'off',
      '@next/next/no-img-element': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      camelcase: 'off',
      'class-methods-use-this': 'off',
      'comma-dangle': ['error', 'never'],
      'max-classes-per-file': 'off',
      'max-len': 'off',
      'max-lines': 'off',
      'no-alert': 'off',
      'no-empty-function': 'off',
      'no-nested-ternary': 'off',
      'no-param-reassign': 'off',
      'no-shadow': ['error', { hoist: 'never' }],
      'no-underscore-dangle': 'off',
      'no-unused-expressions': 'off',
      'no-unused-vars': 'off',
      'no-use-before-define': 'off',
      'no-useless-constructor': 'off',
      quotes: ['error', 'single']
    }
  }
];
