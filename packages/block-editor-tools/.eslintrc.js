module.exports = {
  root: true,
  extends: [
    '@alleyinteractive/eslint-config/typescript-react',
  ],
  parserOptions: {
    project: './tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    'import/no-cycle': 'off',
    'react/require-default-props': 'off',
    'react/function-component-definition': 'off',
  },
  settings: {
    'import/resolver': 'webpack',
  },
};
