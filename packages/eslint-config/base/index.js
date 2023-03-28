/**
 * Base configuration using Airbnb's base config.
 * Includes the babel parser.
 */
const baseConfigs = [
  '../configs/env.js',
  '../parsers/babel.js',
].map(require.resolve);

module.exports = {
  extends: [
    'airbnb/base',
    ...baseConfigs,
  ],
};