/**
 * Base configuration using Airbnb's base config.
 * Includes the babel parser.
 */
const env = require('../configs/env');
const parser = require('../parsers/babel');

module.exports = {
  extends: [
    'airbnb/base',
  ],
  ...env,
  ...parser,
};
