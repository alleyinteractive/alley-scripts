/**
 * Typescript configuration using AirBnBs ESLint config and Airbnb Typescript.
 */
const packageConfigs = [
  '../configs/react',
  '../parsers/typescript',
].map(require.resolve);

module.exports = {
  extends: [
    ...packageConfigs,
    'airbnb-typescript',
  ],
  rules: {
    'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
    'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
    'react/require-default-props': 'off',
  },
};
