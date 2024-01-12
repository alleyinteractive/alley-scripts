#!/usr/bin/env node
/* eslint-disable no-console */

// import chalk from 'chalk';
// import path from 'path';
// import fs from 'fs';
import prompts from 'prompts';

import entryArgs from './src/entryArgs.js';
import { discoverFeatures, locateScaffolderRoot } from './src/discovery.js';
import handleError from './src/error.js';

// const rl = createInterface
/**
 * Alley Scaffolder
 */
(async () => {
  const root: string | null = entryArgs.root || await locateScaffolderRoot();

  if (!root) {
    handleError('🚨 Could not locate a scaffolder configuration directory (.scaffolder) Ensure that one exists in the current or parent directories or pass the --root argument to specify a path.'); // eslint-disable-line max-len
    process.exit(1);
  }

  const features = await discoverFeatures(root);

  if (!features.length) {
    handleError(`No features found in ${root}. Ensure that the features have a config.yml file.`);
    process.exit(1);
  }

  const emojis = ['👋', '🌸', '🚀']; // TODO: Add more emojis.
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

  console.log(`${randomEmoji} Welcome to @alleyinteractive/scaffolder!`);

  // Prompt the user to select a feature.
  const { featureName } = await prompts({
    type: 'select',
    name: 'featureName',
    message: 'Select a feature to scaffold:',
    choices: features.map((item) => ({
      title: item.name,
      value: item.name,
    })),
  });

  const feature = features.find((item) => item.name === featureName);

  if (!feature) {
    handleError(`Could not find the feature ${featureName}`);
    process.exit(1);
  }

  // Parse the inputs from the feature configuration and prompt the user for them.

  // Go through each file and generate the file from the calculated inputs.

  // Put the file in the new location.

  console.log('🎉 Done. Happy coding!');

  process.exit(0);
})();
