#!/usr/bin/env node

/* eslint-disable no-console */

import prompts from 'prompts';

import entryArgs from './src/entryArgs.js';
import { discoverFeatures, locateScaffolderRoot } from './src/discovery.js';
import handleError from './src/error.js';
import processFeature from './src/feature.js';

/**
 * Alley Scaffolder
 */
(async () => {
  const root: string | null = entryArgs.root || await locateScaffolderRoot();

  if (!root) {
    handleError('🚨 Could not locate a scaffolder configuration directory (.scaffolder) Ensure that one exists in the current or parent directories or pass the --root argument to specify a path.'); // eslint-disable-line max-len
  }

  const features = await discoverFeatures(root);

  if (!features.length) {
    handleError(`No features found in ${root}. Ensure that the features have a config.yml file.`);
  }

  const emojis = ['👋', '🌸', '🚀']; // TODO: Add more emojis.
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

  console.log(`${randomEmoji} Welcome to @alleyinteractive/scaffolder!`);

  // Prompt the user to select a feature.
  // TODO: Allow a prompt to be passed in via the CLI.
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
  }

  // Hand off the feature to the feature processor.
  await processFeature(root, feature);

  console.log('🎉 Done. Happy coding!');

  process.exit(0);
})();
