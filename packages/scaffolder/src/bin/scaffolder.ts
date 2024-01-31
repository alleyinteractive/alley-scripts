#!/usr/bin/env node

import entryArgs, { EntryArgs } from '../entryArgs';
import { getProjectDirectory } from '../configuration';

import { initializeLogger } from '../logger';
import { run } from '../run';

/**
 * Alley Scaffolder
 */
(async () => {
  const {
    debug = false,
    'dry-run': dryRun = false,
    _unknown: argv = undefined,
  } = entryArgs as EntryArgs & { _unknown?: string[] };

  // Ensure the project directory is calculated first.
  getProjectDirectory(entryArgs.root);

  const logger = initializeLogger(debug);

  logger.debug('Starting scaffolder...');

  await run(argv, dryRun);

  logger.info('🎉 Done. Happy coding!');

  process.exit(0);
})();
