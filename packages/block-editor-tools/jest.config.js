const path = require('path');

module.exports = {
  preset: 'ts-jest',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    // npm installs a nested React for @wordpress/element. WordPress provides one
    // copy at runtime, so render tests must load one copy too.
    '^react$': path.dirname(require.resolve('react/package.json')),
    '^react-dom$': path.dirname(require.resolve('react-dom/package.json')),
    '^react/(.*)$': `${path.dirname(require.resolve('react/package.json'))}/$1`,
    '^react-dom/(.*)$': `${path.dirname(require.resolve('react-dom/package.json'))}/$1`,
  },
  modulePathIgnorePatterns: [
    '<rootDir>/dist/',
  ],
  testEnvironment: 'node',
};
