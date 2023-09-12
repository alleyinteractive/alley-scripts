const env = require('./env');
const imports = require('../rules/imports');

module.exports = {
  extends: [
    'airbnb',
    'airbnb/hooks',
  ],
  ...env,
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
    'react/jsx-props-no-spreading': 'off',
    'react/react-in-jsx-scope': 'off',
    ...imports.rules,
  },
};
