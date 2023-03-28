/**
 * Typescript configuration using AirBnBs ESLint config and Airbnb Typescript.
 */
const packageConfigs = [
  '../configs/react',
  '../parsers/typescript',
].map(require.resolve);

module.exports = {
  extends: [
    'airbnb-typescript',
    ...packageConfigs,
  ],
};
