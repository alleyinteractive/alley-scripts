const tsConfig = require('@alleyinteractive/eslint-config/typescript');

module.exports = [
  ...tsConfig,
  {
    rules: {
      'import/prefer-default-export': 'off',
    },
  },
];
