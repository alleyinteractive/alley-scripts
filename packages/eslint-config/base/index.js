/**
 * Base configuration using Airbnb's base config.
 * Includes the babel parser.
 */
const env = require('../configs/env');
const parser = require('../parsers/babel');
const imports = require('../rules/imports');

module.exports = {
  extends: [
    'airbnb/base',
  ],
  ...env,
  ...parser,
  rules: {
    ...imports.rules,
  },
};
