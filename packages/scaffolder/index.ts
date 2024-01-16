#!/usr/bin/env node

/* eslint-disable no-console */

import chalk from 'chalk';
import prompts from 'prompts';

import entryArgs from './src/entryArgs.js';
import { discoverFeatures, locateScaffolderRoot } from './src/discovery.js';
import handleError from './src/error.js';
import processFeature from './src/feature.js';

import type { Feature } from './src/types.js';

/**
 * Alley Scaffolder
 */
(async () => {
  const {
    'dry-run': dryRun = false,
    _unknown: argv = undefined,
  } = entryArgs;

  // Reminder: The root directory is the root of the project, not the .scaffolder directory.
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

  let feature: Feature | undefined;

  // Allow a feature to be passed in via the CLI.
  if (Array.isArray(argv) && typeof argv[0] !== 'undefined') {
    const [featureName = ''] = argv;

    // Attempt to find the feature by name case-insensitively supporting partial matches.
    feature = features.find(
      (item) => item.config.name.toLowerCase().includes(featureName.toLowerCase()),
    );

    if (!feature) {
      handleError(`Could not find the feature: ${chalk.yellow(featureName)}`);
    }

    console.log(`🔍 Found feature: ${chalk.yellow(feature.config.name)}`);
  } else {
    // Prompt the user to select a feature.
    const { featureName } = await prompts({
      type: 'select',
      name: 'featureName',
      message: 'Select a feature to scaffold:',
      choices: features.map((item) => ({
        title: item.config.name,
        value: item.config.name,
      })),
    });

    if (!featureName) {
      handleError('No feature selected.');
    }

    feature = features.find((item) => item.config.name === featureName);

    if (!feature) {
      handleError(`Could not find the feature ${featureName}`);
    }
  }

  // Hand off the feature to the feature processor.
  await processFeature(root, feature, dryRun);

  console.log('🎉 Done. Happy coding!');

  process.exit(0);
})();
