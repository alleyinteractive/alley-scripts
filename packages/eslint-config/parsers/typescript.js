const { cwd } = require('node:process');
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
    /**
     * This configuration tells the parser how to find the TSConfig for each source file.
     * (true indicates to find the closest tsconfig.json for each source file)
     */
    project: true,
    /**
     * This configuration tells the parser the absolute path to your project's root directory.
     * @see https://typescript-eslint.io/packages/parser#tsconfigrootdir
     */
    tsconfigRootDir: cwd(),
  },
  /**
   * By default, ESLint looks for configuration files in all parent folders up to the root
   * directory. This can be useful if you want all of your projects to follow a certain convention,
   * but can sometimes lead to unexpected results.
   *
   * To limit ESLint to a specific project, place "root": true inside the .eslintrc.* file
   * or eslintConfig field of the package.json file or in the .eslintrc.* file at your project’s
   * root level.
   * ESLint stops looking in parent folders once it finds a configuration with "root": true.
   *
   * @see https://eslint.org/docs/latest/use/configure/configuration-files#cascading-and-hierarchy
   */
  root: true,
};
