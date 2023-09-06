#!/usr/bin/env node
const { spawn } = require('node:child_process');
const { argv, cwd } = require('node:process');

const {
  getArgFromCLI,
  getWebpackConfig,
  hasArgInCLI,
} = require('./utils');

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

/**
 * The default directory where wp-scripts will detect entry point directories
 * that are not blocks. These entries can be slotfills or webpack entry points.
 *
 * @type {string|undefined}
 */
process.env.ENTRIES_DIRECTORY = hasArgInCLI('--webpack-entries-dir')
  ? getArgFromCLI('--webpack-entries-dir') : 'entries';

// Call wp-scripts with the default arguments.
spawn(
  'wp-scripts',
  [
    ...argv.slice(2),
    ...defaultArgs,
  ],
  {
    cwd: cwd(),
    stdio: 'inherit',
  },
);
