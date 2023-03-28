/**
 * Typescript ESLint parser.
 * @see https://typescript-eslint.io/architecture/parser/
 *
 * This configuration requires a project level tsconfig.json file.
 */
module.exports = {
  extends: [require.resolve('./parserOptions.js')],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
};
