import chalk from 'chalk';

// Services.
import {
  FileGenerator,
  Generator,
  JavaScriptGenerator,
  RepositoryGenerator,
} from '../generators';

// Types.
import type { FeatureConfig, RegisteredFeature } from '../types';
import { ComposerGenerator } from '../generators/composer';

/**
 * Convert a YAML feature configuration to a generator.
 *
 * @param {FeatureConfig} config The selected YAML feature configuration.
 * @param {string} configPath The path to the feature configuration
 *                            directory that defined the feature.
 */
export const configToGenerator = (
  config: FeatureConfig,
  configPath: string,
): Generator<FeatureConfig> => {
  const { name, type = 'file' } = config;

  if (type === 'file') {
    return new FileGenerator(config, configPath);
  } if (type === 'repository') {
    return new RepositoryGenerator(config, configPath);
  } if (type === 'composer') {
    return new ComposerGenerator(config, configPath);
  }

  // Throw an error if an invalid type has reached this far (though Joi
  // validation should have caught it).
  throw new Error(`The feature "${name}" has an invalid type "${chalk.yellow(type)}" defined.`);
};

/**
 * Convert a registered feature to a generator.
 *
 * @param {RegisteredFeature} feature The selected feature.
 * @param {string} directory The path to the feature configuration
 *                           directory that defined the feature.
 */
export const featureToGenerator = (
  feature: RegisteredFeature,
  directory: string,
): Generator<RegisteredFeature> => {
  if (feature.type === 'javascript') {
    return new JavaScriptGenerator(feature, directory);
  }

  return configToGenerator(feature, directory);
};
