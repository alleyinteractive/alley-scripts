import fs from 'fs';
import chalk from 'chalk';

import type { Feature, FeatureConfig } from '../../types';
import { parseConfiguration } from '../configuration';
import { getSourceDirectories } from './sources';

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
