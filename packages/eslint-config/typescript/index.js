/**
 * Base Typescript configuration using Airbnb's base config without React.
 */
const packageConfigs = [
  '../configs/env',
  '../parsers/typescript',
].map(require.resolve);

module.exports = {
  extends: [
    'airbnb/base',
    'airbnb-typescript/base',
    ...packageConfigs,
  ],
};
