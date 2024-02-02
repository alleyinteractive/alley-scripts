import path from 'node:path';
import chalk from 'chalk';

// Services.
import { FileGenerator, Generator, RepositoryGenerator } from '../generators';

// Types.
import type { FeatureConfig } from '../types/config';

/**
 * Convert a feature configuration to a generator.
 */
export const configToGenerator = (config: FeatureConfig, configFilePath: string): Generator => {
  const { name, type = 'file' } = config;

  if (type === 'file') {
    return new FileGenerator(config, path.dirname(configFilePath));
  } if (type === 'repository') {
    return new RepositoryGenerator(config, path.dirname(configFilePath));
  }

  // Throw an error if an invalid type has reached this far (though Joi
  // validation should have caught it).
  throw new Error(`The feature "${name}" has an invalid type "${chalk.yellow(type)}" defined.`);
};
