const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const babelParser = require('@babel/eslint-parser');
const globals = require('globals');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  ...compat.extends('airbnb', 'airbnb/hooks'),
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
        ...globals.es2021,
        ...globals.jest,
        ...globals.node,
      },
    },
    settings: {
      'import/resolver': 'webpack',
    },
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          message: 'Ternaries must be used instead of && in JSX expressions to avoid the potential for accidental output. Use, for example, {condition ? <Element /> : null}.',
          selector: ":matches(JSXElement, JSXFragment) > JSXExpressionContainer > LogicalExpression[operator='&&']",
        },
        {
          message: 'Ternaries must be used instead of || in JSX expressions to avoid the potential for accidental output. Use, for example, {thing1 ? thing1 : thing2}.',
          selector: ":matches(JSXElement, JSXFragment) > JSXExpressionContainer > LogicalExpression[operator='||']",
        },
      ],
    },
  },
];
