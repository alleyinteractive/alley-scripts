import chalk from 'chalk';
import fg from 'fast-glob';
import path from 'node:path';

import type { FeatureConfig } from '../../types';
import { Feature, FileFeature, RepositoryFeature } from '../feature';
import { getLookupSources } from './sources';
import { logger } from '../logger';
import { parseYamlFile, validateFeatureConfiguration } from '../yaml';
import handleError from '../error';

/**
 * Discover all feature configurations in a directory.
 *
 * Using glob patterns, we can discover all the feature configurations
 * (<feature>/config.yml files) in a directory.
 */
async function discoverFeatureConfigurations(directory: string, cwd: string): Promise<string[]> {
  return fg.glob(`${directory}/*/config.yml`, {
    absolute: true,
    cwd,
    ignore: [
      '**/.scaffolder/config.yml',
    ],
  });
}

/**
 * Discover features that can be used.
 *
 * @todo Add caching to improve performance.
 */
export async function getFeatures(rootDirectory: string): Promise<Feature[]> {
  logger().debug(`Discovering features in ${rootDirectory}`);

  const sourceDirectories = await getLookupSources(rootDirectory);

  logger().debug(`Found the following sources to discover from:\n${JSON.stringify(sourceDirectories, null, 2)}`);

  const fileIndex = await Promise.all(
    sourceDirectories
      .map(async ({ directory, root: sourceRelativeRoot = null }) => discoverFeatureConfigurations(
        directory,
        sourceRelativeRoot || rootDirectory,
      )),
  )
    // Flatten the file index and remove duplicates.
    .then((files) => files.flat().filter((file, index, arr) => arr.indexOf(file) === index));

  logger().debug(`Found ${fileIndex.length} features.`);

  if (!fileIndex.length) {
    return [];
  }

  return Promise.all(
    fileIndex.map(async (file) => { // eslint-disable-line consistent-return
      logger().debug(`Parsing feature configuration from ${chalk.yellow(file)}`);

      const config = await parseYamlFile<FeatureConfig>(file);

      try {
        validateFeatureConfiguration(config);
      } catch (err: any) {
        logger().warn(`The feature "${chalk.italic(file)}" is invalid and is not being loaded: ${chalk.yellow(err.message)}\n`);
        return null;
      }

      if (!config.name) {
        logger().warn(`The feature "${chalk.yellow(file)}" does not have a name defined in the config.yml file. Using the directory name as the feature name.`);

        // Use the directory name as the feature name.
        config.name = path.basename(path.dirname(file));
      }

      const { type = 'file' } = config;

      if (type === 'file') {
        return new FileFeature(config, file, path.dirname(file));
      } if (type === 'repository') {
        return new RepositoryFeature(config, file, path.dirname(file));
      }

      // Throw an error if an invalid type has reached this far though Joi
      // validation should have caught it.
      handleError(`The feature "${chalk.yellow(file)}" has an invalid type "${chalk.yellow(type)}" defined in the config.yml file.`);
    }),
  )
    .then((features) => features.filter((feature) => feature !== null)) as Promise<Feature[]>;
}
