/**
 * Typescript configuration using AirBnBs ESLint config and Airbnb Typescript.
 */
const env = require('../configs/env');
const reactConfig = require('../configs/react');
const typescriptParser = require('../parsers/typescript');
const imports = require('../rules/imports');

module.exports = {
  extends: [
    'airbnb-typescript',
    ...reactConfig.extends,
  ],
  plugins: ['react', '@typescript-eslint'],
  ...env,
  ...typescriptParser,
  rules: {
    ...reactConfig.rules,
    'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
    'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
    'react/require-default-props': 'off',
    ...imports.rules,
  },
};
