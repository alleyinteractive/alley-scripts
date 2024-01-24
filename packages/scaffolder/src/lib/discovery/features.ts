import chalk from 'chalk';
import fg from 'fast-glob';
import path from 'path';

import type { Feature, FeatureConfig } from '../../types';
import { getLookupSources } from './sources';
import { logger } from '../logger';
import { parseYamlFile, validateFeatureConfiguration } from '../yaml';

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
  const sourceDirectories = await getLookupSources(rootDirectory);

  const fileIndex = await Promise.all(
    sourceDirectories
      .map(async ({ directory, root: sourceRelativeRoot = null }) => discoverFeatureConfigurations(
        directory,
        sourceRelativeRoot || rootDirectory,
      )),
  )
    // Flatten the file index and remove duplicates.
    .then((files) => files.flat().filter((file, index, arr) => arr.indexOf(file) === index));

  if (!fileIndex.length) {
    return [];
  }

  return Promise.all(
    fileIndex.map(async (file) => {
      const config = await parseYamlFile<FeatureConfig>(file);

      try {
        validateFeatureConfiguration(config);
      } catch (err: any) {
        logger().warn(`The feature "${file}" is invalid: ${chalk.yellow(err.message)}`);
        return null;
      }

      if (!config.name) {
        logger().warn(`The feature "${chalk.yellow(file)}" does not have a name defined in the config.yml file. Using the directory name as the feature name.`);

        // Use the directory name as the feature name.
        config.name = path.basename(path.dirname(file));
      }

      return {
        config,
        configPath: file,
        path: path.dirname(file),
      } as Feature;
    }),
  )
    .then((features) => features.filter((feature) => feature !== null)) as Promise<Feature[]>;
}
