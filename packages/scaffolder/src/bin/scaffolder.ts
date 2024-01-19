#!/usr/bin/env node

/* eslint-disable no-console */

import chalk from 'chalk';
import prompts from 'prompts';

import entryArgs, { EntryArgs } from '../lib/entryArgs';
import { getScaffolderRoot } from '../lib/configuration';
import { getFeatures } from '../lib/discovery';
import handleError from '../lib/error';
import processFeature from '../lib/run';

import type { Feature } from '../types';

/**
 * Alley Scaffolder
 *
 * @todo Refeactor all the services used here to a separate package.
 */
(async () => {
  const {
    'dry-run': dryRun = false,
    _unknown: argv = undefined,
  } = entryArgs as EntryArgs & { _unknown?: string[] };

  // Reminder: The root directory is the root of the project, not the .scaffolder directory.
  let root: string | null = entryArgs.root || await getScaffolderRoot();

  if (!root) {
    console.log('No scaffolder configuration found, using current directory as root.');
    console.log(chalk.italic(chalk.blueBright('Use the --root option to specify a different root directory or create a .scaffolder directory.')));

    root = process.cwd();
  }

  console.log('getFeatures', getFeatures);

  const features = await getFeatures(root);

  if (!features.length) {
    handleError(`No features found to scaffold in ${root}.\n\nEnsure that your configuration isn't inadvertently overriding the built-in sources included with the scaffolder.`);
  }

  const emojis = ['👋', '🌸', '🚀']; // TODO: Add more emojis.
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

  console.log(`${randomEmoji} Welcome to @alleyinteractive/scaffolder!`);

  if (dryRun) {
    console.log('🚨 Running in dry-run mode. No files will be generated.');
  }

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
