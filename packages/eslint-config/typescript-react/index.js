/**
 * Typescript configuration using AirBnBs ESLint config and Airbnb Typescript.
 */
const reactConfig = require('../configs/react');
const typescriptParser = require('../parsers/typescript');

module.exports = {
  extends: [
    'airbnb-typescript',
    ...reactConfig.extends,
  ],
  ...typescriptParser,
  rules: {
    'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
    'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
    'react/require-default-props': 'off',
  },
};
