const tsConfig = require('@alleyinteractive/eslint-config/typescript');

module.exports = [
  ...tsConfig,
  {
    rules: {
      'no-console': 'off',
    },
  },
];
