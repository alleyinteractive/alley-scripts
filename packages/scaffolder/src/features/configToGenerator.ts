import chalk from 'chalk';

// Services.
import { FileGenerator, Generator, RepositoryGenerator } from '../generators';

// Types.
import type { FeatureConfig } from '../types/config';
import { ComposerGenerator } from '../generators/composer';

/**
 * Convert a feature configuration to a generator.
 *
 * @param {FeatureConfig} config The feature configuration.
 * @param {string} configPath The path to the feature configuration
 *                            directory that defined the feature.
 */
export const configToGenerator = (config: FeatureConfig, configPath: string): Generator => {
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
