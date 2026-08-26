import chalk from 'chalk';

// Services.
import {
  FileGenerator,
  Generator,
  JavaScriptGenerator,
  RepositoryGenerator,
} from '../generators';

// Types.
import type { RegisteredFeature } from '../types';
import { ComposerGenerator } from '../generators/composer';

/**
 * Convert a registered feature to a generator.
 *
 * @param {RegisteredFeature} feature The selected feature.
 * @param {string} directory The path to the feature configuration
 *                           directory that defined the feature.
 */
export const featureToGenerator = (feature: RegisteredFeature, directory: string): Generator => {
  if (feature.type === 'javascript') {
    return new JavaScriptGenerator(feature, directory);
  }

  const { name, type = 'file' } = feature;

  if (type === 'file') {
    return new FileGenerator(feature, directory);
  } if (type === 'repository') {
    return new RepositoryGenerator(feature, directory);
  } if (type === 'composer') {
    return new ComposerGenerator(feature, directory);
  }

  // Throw an error if an invalid type has reached this far (though Joi
  // validation should have caught it).
  throw new Error(`The feature "${name}" has an invalid type "${chalk.yellow(type)}" defined.`);
};

export const configToGenerator = featureToGenerator;
