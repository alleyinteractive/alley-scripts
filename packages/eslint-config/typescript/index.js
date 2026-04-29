const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const globals = require('globals');
const { cwd } = require('node:process');
const importsRules = require('../rules/imports');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  ...compat.extends('airbnb/base', 'airbnb-typescript/base'),
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
        tsconfigRootDir: cwd(),
        warnOnUnsupportedTypeScriptVersion: false,
        ecmaFeatures: { globalReturn: true, impliedStrict: true, jsx: true },
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.es2022,
        ...globals.jest,
        ...globals.node,
      },
    },
    rules: {
      ...importsRules.rules,
    },
  },
];
