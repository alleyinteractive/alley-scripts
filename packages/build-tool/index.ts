#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { argv, cwd } from 'node:process';

// eslint-disable-next-line import/no-unresolved
import { getDefaultArgs, hasArgInCLI, getArgFromCLI } from './utils';
/**
 * The default arguments to pass to wp-scripts.
 */
const defaultArgs: string[] = getDefaultArgs() || [];

/**
 * Set the environment variable for the path to the webpack entries directory.
 *
 * @type {string|undefined}
 */
process.env.ENTRIES_DIRECTORY = hasArgInCLI('--webpack-entries-dir')
  ? getArgFromCLI('--webpack-entries-dir') : 'entries';

/**
 * Set the environment variable to only build blocks.
 */
process.env.BLOCKS_ONLY = hasArgInCLI('--webpack-blocks-only') ? 'true' : 'false';

/**
 * Set the environment variable for the path to the WordPress source directory.
 *
 * This has been added to support backwards compatibility when using a version of wp-scripts
 * less than version 30.8.0.
 */
if (hasArgInCLI('--source-path')) {
  process.env.WP_SOURCE_PATH = getArgFromCLI('--source-path') || 'blocks';
} else if (hasArgInCLI('--webpack-src-dir')) {
  process.env.WP_SOURCE_PATH = getArgFromCLI('--webpack-src-dir') || 'blocks';
} else {
  process.env.WP_SOURCE_PATH = 'blocks';
}

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
