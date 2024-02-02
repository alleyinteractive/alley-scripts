#!/usr/bin/env node

import entryArgs, { EntryArgs } from '../entryArgs';
import { initializeLogger } from '../logger';
import { run } from '../run';
import { initializeConfigurationStore } from '../configuration';

/**
 * Alley Scaffolder
 */
(async () => {
  const {
    debug = false,
    'dry-run': dryRun = false,
    _unknown: argv = undefined,
  } = entryArgs as EntryArgs & { _unknown?: string[] };

  const logger = initializeLogger(debug);

  // Load all configuration files cascading up from the current working directory.
  initializeConfigurationStore(entryArgs.root || process.cwd());

  logger.debug('Starting scaffolder...');

  await run(argv, dryRun);

  logger.info('🎉 Done. Happy coding!');

  process.exit(0);
})();
