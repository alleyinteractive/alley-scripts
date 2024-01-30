import chalk from 'chalk';
import prompts from 'prompts';

import { Feature } from './feature';
import handleError from './error';
import { logger } from './logger';

/**
 * Prompt the user to select a feature from a list of features.
 *
 * Allows the user to select a feature by name using a fuzzy search.
 */
export default async function resolveFeature(features: Feature[], featureName?: string): Promise<Feature> { // eslint-disable-line consistent-return, max-len
  let availableFeatures = features;

  if (featureName) {
    // Attempt to find the feature by name case-insensitively supporting partial
    // matches. If multiple features match, allow the user to select from the
    // matched features.
    const matchedFeatures = features.filter(
      (item) => item.config.name.toLowerCase().includes(featureName.toLowerCase()),
    );

    if (!matchedFeatures.length) {
      handleError(`Could not find the feature: ${chalk.yellow(featureName)}`);
    }

    // If multiple features match, prompt the user to select from the matched features.
    if (matchedFeatures.length > 1) {
      availableFeatures = matchedFeatures;
    } else {
      logger().info(`🔍 Found feature: ${chalk.yellow(matchedFeatures[0].config.name)}`);

      return matchedFeatures[0];
    }
  }

  // Prompt the user to select a feature.
  const { name } = await prompts({
    type: 'select',
    name: 'name',
    message: featureName
      ? `Select a feature to scaffold from that includes "${featureName}:`
      : 'Select a feature to scaffold:',
    choices: availableFeatures.map((item) => ({
      title: item.config.name,
      value: item.config.name,
    })),
  });

  if (!name) {
    handleError('No feature selected.');
  }

  const feature = features.find((item) => item.config.name === name);

  if (!feature) {
    handleError(`Could not find the feature ${name}`);
  }

  return feature;
}
