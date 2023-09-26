module.exports = {
  rules: {
    /**
     * Ensure that file extensions are not required for imports for the extensions below.
     *
     * https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/extensions.md
     */
    'import/extensions': [
      'error',
      'always',
      {
        pattern: {
          js: 'never',
          ts: 'never',
          jsx: 'never',
          tsx: 'never',
          mjs: 'never',
        },
      },
    ],
  },
};
