/**
 * Base Typescript configuration using Airbnb's base config without React.
 */
const env = require('../configs/env');
const parser = require('../parsers/typescript');

module.exports = {
  extends: [
    'airbnb/base',
    'airbnb-typescript/base',
  ],
  ...env,
  ...parser,
};
