const tsReactConfig = require('@alleyinteractive/eslint-config/typescript-react');

module.exports = [
  ...tsReactConfig,
  {
    languageOptions: {
      parserOptions: {
        project: 'tsconfig.eslint.json',
        tsconfigRootDir: __dirname,
      },
    },
  },
];
