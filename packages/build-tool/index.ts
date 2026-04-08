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
).on('exit', (code, signal) => {
  if (signal) {
    process.exit(1);
  } else {
    process.exit(code ?? 0);
  }
});
