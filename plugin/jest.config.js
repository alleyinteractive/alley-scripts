// eslint-disable-next-line import/no-extraneous-dependencies
const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
  preset: 'ts-jest',
  transform: {
    // For transformations with .ts and .tsx files.
    ...tsjPreset.transform,
    // For transformations with .js and .jsx filxwes.
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  modulePathIgnorePatterns: [
    '.buddy-tests',
  ],
  testEnvironment: 'node',
};
