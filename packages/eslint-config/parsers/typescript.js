const parserOptions = require('./parserOptions');

/**
 * Typescript ESLint parser.
 * @see https://typescript-eslint.io/architecture/parser/
 *
 * This configuration requires a project level tsconfig.json file.
 */
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ...parserOptions.parserOptions,
    project: './tsconfig.json',
  },
};
