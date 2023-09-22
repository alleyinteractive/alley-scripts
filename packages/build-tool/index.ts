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
