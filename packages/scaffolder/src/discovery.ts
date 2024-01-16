/* eslint-disable import/prefer-default-export */

import fs from 'fs';
import { parse } from 'yaml';
import chalk from 'chalk';

import type { Feature, FeatureConfig, RootConfiguration } from './types.js';

/**
 * Functionality to aid in the discovery of templates that can be used to
 * generate code.
 *
 * Out of the box we'll look for templates in the current folder and all the
 * parent directories. The end goal is to add the ability to look for templates
 * in a shared remote resource like a git repository.
 */

/**
 * Locate the template directory, recursively searching up the directory tree
 * until a template directory is found.
 *
 * A template directory is defined as a directory that contains a `.scaffolder`
 * directory.
 */
export async function locateScaffolderRoot() {
  // Recursively search up the directory tree until a template directory is
  // found. Ensure that we eventually stop at the root directory.
  let currentDirectory = process.cwd();

  while (true) { // eslint-disable-line no-constant-condition
    if (fs.existsSync(`${currentDirectory}/.scaffolder`)) {
      return currentDirectory;
    }

    if (!fs.existsSync(currentDirectory)) {
      break;
    }

    currentDirectory = fs.realpathSync(`${currentDirectory}/..`);

    // Stop at the root directory.
    if (currentDirectory === '/') {
      break;
    }
  }

  return null;
}

/**
 * Parse the YAML configuration file of a scaffolder feature.
 */
export async function parseConfiguration<TData extends object>(filePath: string): Promise<TData> {
  // Ensure this is a YAML file.
  if (!filePath.endsWith('.yml')) {
    throw new Error('The configuration file must be a YAML file.');
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`The configuration file does not exist: ${filePath}`);
  }

  return parse(fs.readFileSync(filePath, 'utf8'));
}

let rootConfiguration: RootConfiguration;

/**
 * Get the root configuration for the scaffolder.
 *
 * The root configuration is defined in the `.scaffolder/config.yml` file.
 */
export async function getRootConfiguration(rootDirectory: string) {
  if (!rootConfiguration && fs.existsSync(`${rootDirectory}/.scaffolder/config.yml`)) {
    rootConfiguration = await parseConfiguration<RootConfiguration>(`${rootDirectory}/.scaffolder/config.yml`);
  } else if (!rootConfiguration) {
    rootConfiguration = {};
  }

  return rootConfiguration;
}

/**
 * Discover features that are defined in the scaffolder root directory that can
 * be discovered and used.
 *
 * Features are defined as one-level subdirectories of the scaffolder root
 * directory and contain a `config.yml` file.
 */
export async function discoverFeatures(rootDirectory: string): Promise<Feature[]> {
  const scaffolderDirectory = `${rootDirectory}/.scaffolder`;

  if (!fs.existsSync(rootDirectory) || !fs.existsSync(scaffolderDirectory)) {
    return [];
  }

  // The source directories are the directories that contain the features that
  // can be scaffolded to a project.
  const sourceDirectories = [scaffolderDirectory];

  const { sources = [] } = await getRootConfiguration(rootDirectory);

  // Push any additional source directories to the list from the configuration.
  if (Array.isArray(sources) && sources.length) {
    // TODO: Allow remote sources to be defined and the scaffolder directory not
    // to be prepended.
    sourceDirectories.push(
      ...sources.map((source: string) => `${scaffolderDirectory}/${source}`),
    );
  }

  const availableFeatures: Feature[] = [];

  await Promise.all(
    sourceDirectories
      .filter((value, index, self) => self.indexOf(value) === index)
      .map(async (sourceDirectory) => {
        // Present a warning to the user if the source directory does not exist.
        if (!fs.existsSync(sourceDirectory)) {
          console.warn(`Source directory ${chalk.yellow(sourceDirectory)} not found.`); // eslint-disable-line no-console
          return;
        }

        const features = await fs.promises.readdir(sourceDirectory, {
          recursive: false,
          withFileTypes: true,
        });

        const featuresWithConfig = await Promise.all(
          features
            .filter((feature) => feature.isDirectory())
            .map(async (feature) => {
              const configPath = `${sourceDirectory}/${feature.name}/config.yml`;

              if (!fs.existsSync(configPath)) {
                return null;
              }

              const config = await parseConfiguration<FeatureConfig>(configPath);

              if (!config.name) {
                throw new Error(`The feature "${configPath}" does not have a name defined in the config.yml file.`);
              }

              return {
                config,
                path: `${sourceDirectory}/${feature.name}`,
              } as Feature;
            }),
        );

        availableFeatures.push(
          ...featuresWithConfig.filter((feature): feature is Feature => feature !== null),
        );
      }),
  );

  return availableFeatures;
}
