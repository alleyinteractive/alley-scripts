#!/usr/bin/env node

import entryArgs, { EntryArgs } from '../lib/entryArgs';
import { getRootDirectory } from '../lib/configuration';

import { initializeLogger } from '../lib/logger';
import { run } from '../lib/run';

/**
 * Alley Scaffolder
 */
(async () => {
  const {
    debug = false,
    'dry-run': dryRun = false,
    _unknown: argv = undefined,
  } = entryArgs as EntryArgs & { _unknown?: string[] };

  // Ensure the root directory is calculated first.
  getRootDirectory(entryArgs.root);

  const logger = initializeLogger(debug);

  logger.debug('Starting scaffolder...');

  await run(argv, dryRun);

  logger.info('🎉 Done. Happy coding!');

  process.exit(0);
})();
