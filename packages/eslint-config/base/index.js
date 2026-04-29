const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const babelParser = require('@babel/eslint-parser');
const globals = require('globals');
const importsRules = require('../rules/imports');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  ...compat.extends('airbnb/base'),
  {
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaFeatures: { globalReturn: true, impliedStrict: true, jsx: true },
        requireConfigFile: false,
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
