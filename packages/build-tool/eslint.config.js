const tsConfig = require('@alleyinteractive/eslint-config/typescript');

module.exports = [
  ...tsConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './config/tsconfig.eslint.json',
        tsconfigRootDir: __dirname,
      },
    },
  },
];
