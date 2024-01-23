import fs from 'fs';
import chalk from 'chalk';

import type { Feature, FeatureConfig } from '../../types';
import { parseConfiguration } from '../configuration';
import { getConfiguredSources } from './sources';
import { logger } from '../logger';

/**
 * Discover features that can be discovered and used.
 *
 * Loads features configured globally and locally on the project.
 */
export async function getFeatures(rootDirectory: string): Promise<Feature[]> {
  const sourceDirectories = await getConfiguredSources(rootDirectory);
  const availableFeatures: Feature[] = [];

  await Promise.all(
    sourceDirectories
      .map(async ({ directory }) => {
        // Present a warning to the user if the source directory does not exist.
        if (!fs.existsSync(directory)) {
          logger().debug(`Source directory ${chalk.yellow(directory)} not found.`);
          return;
        }

        const features = await fs.promises.readdir(directory, {
          recursive: false,
          withFileTypes: true,
        });

        const featuresWithConfig = await Promise.all(
          features
            .filter((feature) => feature.isDirectory())
            .map(async (feature) => {
              const configPath = `${directory}/${feature.name}/config.yml`;

              if (!fs.existsSync(configPath)) {
                return null;
              }

              const config = await parseConfiguration<FeatureConfig>(configPath);

              if (!config.name) {
                throw new Error(`The feature "${configPath}" does not have a name defined in the config.yml file.`);
              }

              return {
                config,
                path: `${directory}/${feature.name}`,
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
