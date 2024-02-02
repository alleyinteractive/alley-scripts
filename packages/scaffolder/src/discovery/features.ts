import chalk from 'chalk';
import fg from 'fast-glob';
import path from 'node:path';
import { uniqBy } from 'lodash';

import type { FeatureConfig } from '../types';
import { Feature, FileFeature, RepositoryFeature } from '../feature';
import { getLookupSources } from './sources';
import { logger } from '../logger';
import { parseYamlFile, validateFeatureConfiguration } from '../yaml';
import handleError from '../error';
import {
  getGlobalConfiguration,
  getGlobalDirectory,
  getProjectConfiguration,
  getProjectDirectory,
} from '../configuration';

/**
 * Discover all feature configurations in a directory.
 *
 * Using glob patterns, we can discover all the feature configurations
 * (<feature>/config.yml files) in a directory.
 *
 * @todo Allow index.js files to be used as features.
 */
// async function discoverFeatureConfigurations(directory: string, cwd: string): Promise<string[]> {
//   return fg.glob(`${directory}/*/config.yml`, {
//     absolute: true,
//     cwd,
//     ignore: [
//       '**/.scaffolder/config.yml',
//     ],
//   });
// }

// /**
//  * Take a feature configuration and convert it to a feature object.
//  */
// function parseFeatureConfiguration(config: FeatureConfig, directory: string): Feature { // eslint-disable-line max-len, consistent-return
//   const { type = 'file' } = config;

//   if (type === 'file') {
//     return new FileFeature(config, directory);
//   } if (type === 'repository') {
//     return new RepositoryFeature(config, directory);
//   }

//   // Throw an error if an invalid type has reached this far though Joi
//   // validation should have caught it.
//   handleError(`The feature "${config.name}" has an invalid type "${chalk.yellow(type)}" defined.`);
// }

// /**
//  * Retrieve the features configured by the project and global configuration.
//  *
//  * These are features defined under the "features" key in the project and global
//  * configuration files.
//  */
// async function getConfiguredFeatures(): Promise<Feature[]> {
//   const globalDirectory = getGlobalDirectory();
//   const projectDirectory = getProjectDirectory();

//   const { features: globalFeatures = [] } = getGlobalConfiguration();
//   const { features: projectFeatures = [] } = getProjectConfiguration();

//   return uniqBy([
//     ...globalFeatures.map((feature) => parseFeatureConfiguration(feature, globalDirectory)),
//     ...projectFeatures.map((feature) => parseFeatureConfiguration(feature, projectDirectory)),
//   ], (feature) => feature.config.name);
// }

// /**
//  * Discover features that can be used.
//  *
//  * This function starts off the discovery process of finding all available
//  * features that can be used by the scaffolder.
//  *
//  * @todo Add caching to improve performance.
//  */
// export async function getFeatures(): Promise<Feature[]> {
//   const rootDirectory = getProjectDirectory();

//   logger().debug(`Discovering features in ${rootDirectory}`);

//   const sourceDirectories = await getLookupSources();

//   logger().debug(`Found the following sources to discover from:\n${JSON.stringify(sourceDirectories, null, 2)}`);

//   const fileIndex = await Promise.all(
//     sourceDirectories
//       .map(async ({ directory, root: sourceRelativeRoot = null }) => discoverFeatureConfigurations(
//         directory,
//         sourceRelativeRoot || rootDirectory,
//       )),
//   )
//     // Flatten the file index and remove duplicates.
//     .then((files) => files.flat().filter((file, index, arr) => arr.indexOf(file) === index));

//   logger().debug(`Found ${fileIndex.length} features.`);

//   const configuredFeatures = await getConfiguredFeatures();

//   if (!fileIndex.length) {
//     return configuredFeatures;
//   }

//   return Promise.all(
//     fileIndex.map(async (file) => { // eslint-disable-line consistent-return
//       logger().debug(`Parsing feature configuration from ${chalk.yellow(file)}`);

//       const config = await parseYamlFile<FeatureConfig>(file);

//       try {
//         validateFeatureConfiguration(config);
//       } catch (err: any) {
//         logger().warn(`The feature "${chalk.italic(file)}" is invalid and is not being loaded: ${chalk.yellow(err.message)}\n`);
//         return null;
//       }

//       if (!config.name) {
//         logger().warn(`The feature "${chalk.yellow(file)}" does not have a name defined in the config.yml file. Using the directory name as the feature name.`);

//         // Use the directory name as the feature name.
//         config.name = path.basename(path.dirname(file));
//       }

//       // Default the feature type to a file feature.
//       if (!config.type) {
//         config.type = 'file';
//       }

//       return parseFeatureConfiguration(config, path.dirname(file));
//     }),
//   )
//     .then((features) => features.filter((feature) => feature !== null))
//     .then(
//       // Ensure that the features are unique by name.
//       (features) => uniqBy(
//         // Merge in the features configured via the project and global configuration.
//         features.concat(configuredFeatures),
//         (feature) => feature && feature.config.name,
//       ),
//     ) as Promise<Feature[]>;
// }
