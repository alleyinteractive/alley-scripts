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
    /**
     * The following rule is disabled because many of the packages used
     * are @wordpress/* packages and other packages that are listed
     * as externals in the Dependency Extraction Webpack Plugin.
     * Since these packages are not used in the built files but instead referenced as globals,
     * they do not need to be listed in the dependency array. This will cause the rule,
     * 'import/no-extraneous-dependencies' to throw an error.
     */
    'import/no-extraneous-dependencies': 'off',
  },
  settings: {
    'import/resolver': 'webpack',
  },
};
