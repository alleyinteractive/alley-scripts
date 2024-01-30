#!/usr/bin/env node

import chalk from 'chalk';

import entryArgs, { EntryArgs } from '../lib/entryArgs';
import { getScaffolderRoot } from '../lib/configuration';

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

  // Reminder: The root directory is the root of the project, not the .scaffolder directory.
  let root: string | null = entryArgs.root || await getScaffolderRoot();

  // Initialize the logger service.
  const logger = initializeLogger(debug);

  if (!root) {
    logger.info('No configuration found, using current directory as root.');
    logger.info(chalk.italic(chalk.blueBright('Use the --root option to specify a different root directory or create a .scaffolder directory.')));

    root = process.cwd();
  }

  await run(root, argv, dryRun);

  logger.info('🎉 Done. Happy coding!');

  process.exit(0);
})();
