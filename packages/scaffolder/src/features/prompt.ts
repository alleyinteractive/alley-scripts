import chalk from 'chalk';
import prompts, { Choice } from 'prompts';

import handleError from '../error';
import { logger } from '../logger';
import { getFeatureStore } from './store';
import type { FeatureConfig } from '../types';

/**
 * Prompt the user to select a feature from a list of features.
 *
 * Allows the user to select a feature by name using a fuzzy search.
 *
 * @returns {Promise<[FeatureConfig, string]>} The selected feature and the path to the
 *                                             configuration file.
 */
export async function promptUserForFeature(featureName?: string): Promise<[FeatureConfig, string]> { // eslint-disable-line consistent-return, max-len
  const store = getFeatureStore().all();

  // Create a smaller list of available features to prompt the user with.
  let availableFeatures: Choice[] = [];

  Object.keys(store).forEach((configPath) => store[configPath].map(
    (feature, index) => availableFeatures.push({
      title: feature.name,
      value: [configPath, index],
    }),
  ));

  // Attempt to find the feature by name case-insensitively supporting partial
  // matches. If multiple features match, allow the user to select from the
  // smaller list of features.
  if (featureName) {
    availableFeatures = availableFeatures.filter(
      (item) => item.title.toLowerCase().includes(featureName.toLowerCase()),
    );

    if (!availableFeatures.length) {
      handleError(`No feature found that includes "${featureName}"`);
    }

    // If only one feature matches, return it.
    if (availableFeatures.length === 1) {
      logger().info(`🔍 Found feature: ${chalk.yellow(availableFeatures[0].title)}`);

      const [configPath, index] = availableFeatures[0].value;

      return [store[configPath][index], configPath];
    }
  }

  const { selectedFeature } = await prompts({
    choices: availableFeatures,
    // @ts-ignore clearFirst is not in the typings
    clearFirst: true,
    limit: 50,
    message: featureName
      ? `Select a feature to scaffold from that includes "${featureName}":`
      : 'Select a feature to scaffold:',
    name: 'selectedFeature',
    type: 'autocomplete',
    suggest: (input, choices) => Promise.resolve(
      choices.filter((item) => item.title.toLowerCase().includes(input.toLowerCase())),
    ),
  });

  if (!selectedFeature) {
    handleError('No feature selected 😔.');
  }

  const [configPath, index] = selectedFeature;

  return [store[configPath][index], configPath];
}
