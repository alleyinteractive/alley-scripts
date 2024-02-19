#!/usr/bin/env node

import { ScaffolderCommand } from '../command';

/**
 * Alley Scaffolder
 */
(async () => {
  const command = new ScaffolderCommand();

  await command.invoke();

  process.exit(0);
})();
