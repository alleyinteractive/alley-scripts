/* eslint-disable import/prefer-default-export */

import fs from 'fs';
import chalk from 'chalk';

import type { Feature, FeatureConfig } from '../types';
import { getProjectConfiguration, parseConfiguration } from './configuration';

/**
 * Functionality to aid in the discovery of templates that can be used to
 * generate code.
 *
 * Out of the box we'll look for templates in the current folder and all the
 * parent directories. The end goal is to add the ability to look for templates
 * in a shared remote resource like a git repository.
 */

/**
 * Retrieve all the configured source directories to read from.
 */
export async function getSourceDirectories(rootDirectory: string): Promise<string[]> {
  const sourceDirectories = [];

  if (fs.existsSync(`${rootDirectory}/.scaffolder`)) {
    sourceDirectories.push(`${rootDirectory}/.scaffolder`);
  }

  const {
    sources: configuredSources = [],
  } = await getProjectConfiguration(rootDirectory);

  return [
    ...sourceDirectories,
    ...configuredSources,
  ];
}

/**
 * Discover features that are defined in the scaffolder root directory that can
 * be discovered and used.
 *
 * Features are defined as one-level subdirectories of the scaffolder root
 * directory and contain a `config.yml` file.
 */
export async function getFeatures(rootDirectory: string): Promise<Feature[]> {
  const sourceDirectories = await getSourceDirectories(rootDirectory);
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
