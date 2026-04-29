const tsReactConfig = require('@alleyinteractive/eslint-config/typescript-react');

module.exports = [
  ...tsReactConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      'import/no-cycle': 'off',
      'react/require-default-props': 'off',
      'react/function-component-definition': 'off',
      'import/no-extraneous-dependencies': 'off',
    },
    settings: {
      'import/resolver': 'webpack',
    },
  },
];
