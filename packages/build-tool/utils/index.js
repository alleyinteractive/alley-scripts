const path = require('path');
const { existsSync } = require('fs');
const { cwd } = require('node:process');

const { getEntries, processFilename } = require('./webpack');

/**
 * Get the absolute path to a file from the project root.
 *
 * @param {string} fileName - The file name to get the absolute path to.
 *
 * @returns
 */
const fromProjectRoot = (fileName) => path.join(cwd(), fileName);

/**
 * Check if a file exists in the project root.
 *
 * @param {string} fileName - The file name to check for.
 * @returns {boolean}
 */
const hasProjectFile = (fileName) => existsSync(fromProjectRoot(fileName));

/**
 * Get all arguments passed to the CLI.
 *
 * @returns {string[]}
 */
const getArgsFromCLI = () => {
  const args = process.argv.slice(2);
  return args;
};

/**
 * Get the value of an argument passed to the CLI.
 *
 * @param {string} arg - The argument to get the value of.
 * @returns {string|undefined}
 */
const getArgFromCLI = (arg) => {
  let argValue;
  for (const cliArg of process.argv.slice(2)) {
    const [name, value] = cliArg.split('=');
    if (name === arg) {
      // return the value if it exists, otherwise return the name.
      argValue = value || name;
    }
  }
  return argValue;
};

/**
 * Check if an argument is present in the CLI.
 *
 * @param {string} arg - The argument to check for.
 * @returns {boolean}
 */
const hasArgInCLI = (arg) => getArgFromCLI(arg) !== undefined;

/**
 * Get the path to the webpack config file.
 * @returns {string|undefined}
 */
const getWebpackConfig = () => {
  if (hasProjectFile('webpack.config.js')) {
    return fromProjectRoot('webpack.config.js');
  }

  if (hasArgInCLI('--config')) {
    return getArgFromCLI('--config');
  }

  return path.join(__dirname, '../config/webpack.config.js');
};

/**
 * Get the default arguments to pass to wp-scripts.
 *
 * @returns {string[]}
 */
const getDefaultArgs = () => {
  /**
   * The default arguments to pass to wp-scripts.
   *
   * @type {string[]}
   */
  const defaultArgs = [];

  /**
   * If the `build` or `start` command is used, add the necessary wp-scripts args.
   */
  if (hasArgInCLI('build') || hasArgInCLI('start')) {
    defaultArgs.push(`--config=${getWebpackConfig()}`);

    // Include the --webpack-copy-php flag explicitly.
    if (!hasArgInCLI('--webpack-copy-php')) {
      defaultArgs.push('--webpack-copy-php');
    }

    /**
   * The default directory where wp-scripts will detect block.json files.
   * Explicitly set the webpack source directory to "blocks" unless specified.
   *
   * @see https://github.com/WordPress/gutenberg/tree/trunk/packages/scripts#automatic-blockjson-detection-and-the-source-code-directory
   *
   * @type {string|undefined}
   */
    const webpackSrcDir = hasArgInCLI('--webpack-src-dir')
      ? getArgFromCLI('--webpack-src-dir') : 'blocks';

    defaultArgs.push(`--webpack-src-dir=${webpackSrcDir}`);
  }

  return defaultArgs;
};

module.exports = {
  fromProjectRoot,
  getArgFromCLI,
  getArgsFromCLI,
  getDefaultArgs,
  getEntries,
  getWebpackConfig,
  hasArgInCLI,
  hasProjectFile,
  processFilename,
};
