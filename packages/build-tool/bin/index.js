#!/usr/bin/env node
const { spawn } = require('node:child_process');
const { argv, cwd } = require('node:process');

const {
  getArgFromCLI,
  getDefaultArgs,
  hasArgInCLI,
} = require('../utils');

/**
 * The default arguments to pass to wp-scripts.
 *
 * @type {string[]}
 */
const defaultArgs = getDefaultArgs() || [];

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
