#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { rmSync } from 'node:fs';
import { argv, cwd } from 'node:process';

import {
  getBuildDirToPreClean,
  getDefaultArgs,
  hasArgInCLI,
  getArgFromCLI,
// eslint-disable-next-line import/no-unresolved
} from './utils';
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
 * Clean the build directory once before a `build --experimental-modules` run, since the
 * two parallel compilers can't clean it themselves without deleting each other's output.
 */
const buildDirToPreClean = getBuildDirToPreClean();
if (buildDirToPreClean) {
  rmSync(buildDirToPreClean, { recursive: true, force: true });
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
).on('exit', (code, signal) => {
  if (signal) {
    process.exit(1);
  } else {
    process.exit(code ?? 0);
  }
});
