/**
 * Base Typescript configuration using Airbnb's base config without React.
 */
const env = require('../configs/env');
const typescriptParser = require('../parsers/typescript');
const imports = require('../rules/imports');

module.exports = {
  extends: [
    'airbnb/base',
    'airbnb-typescript/base',
  ],
  plugins: ['@typescript-eslint'],
  ...env,
  ...typescriptParser,
  rules: {
    ...imports.rules,
  },
};
