/* eslint-disable max-len */

import path from 'node:path';
import fg from 'fast-glob';
import chalk from 'chalk';

// Services.
import { ConfigurationStore, getConfigurationStore } from '../configuration';
import { logger } from '../logger';
import { resolveSourceToDirectory } from './sources';
import { parseYamlFile, validateFeatureConfiguration } from '../yaml';

// Types.
import type { DirectorySource, FeatureConfig, Source } from '../types';

/**
 * Feature store.
 */
class FeatureStore {
  private config: ConfigurationStore;

  private readonly sources: DirectorySource[] = [];

  private readonly features: Record<string, FeatureConfig[]> = {};

  /**
   * Constructor
   */
  public constructor(store: ConfigurationStore) {
    this.config = store;
  }

  /**
   * Initialize the feature store.
   */
  public async initialize() {
    this.loadDefinedFeaturesFromStore();

    await this.loadSourcesFromStore();
    await this.loadFeaturesFromSources();

    logger().debug(`${Object.values(this.all()).flat().length} features loaded: ${JSON.stringify(this.all(), null, 2)}`);
  }

  /**
   * Add features to the store.
   */
  public add(directory: string, features: FeatureConfig[] | FeatureConfig): void {
    if (!this.features[directory]) {
      this.features[directory] = [];
    }

    if (Array.isArray(features)) {
      features.forEach((feature) => {
        this.add(directory, feature);
      });
    } else {
      // Ensure that the feature is not already registered.
      const registeredNames = Object.values(this.features).flat().map((feature) => feature.name);

      if (registeredNames.includes(features.name)) {
        logger().warn(`The feature "${chalk.yellow(features.name)}" is already registered. Skipping.`);

        return;
      }

      this.features[directory].push(features);
    }
  }

  /**
   * Retrieve all features from the store by their directory.
   */
  public all(): Record<string, FeatureConfig[]> {
    return this.features;
  }

  /**
   * Load the explicitly defined features from the configuration store.
   *
   * These exist as a top-level "features" key on each configuration file.
   */
  public loadDefinedFeaturesFromStore() {
    const features = this.config.pluck('features');

    Object.keys(features).forEach((directory) => {
      if (typeof features[directory] === 'undefined' || !Array.isArray(features[directory])) {
        return;
      }

      if (features[directory] && features[directory]) {
        this.add(directory, features[directory] as FeatureConfig[]);
      }
    });

    logger().debug(`Loaded ${Object.values(this.features).flat().length} defined features from the configuration store.`);
  }

  /**
   * Load the features from the sources defined in the configuration store.
   */
  public async loadSourcesFromStore() {
    const sources = this.config.pluck('sources');
    const sourcesToResolve: Source[] = [];

    Object.keys(sources).forEach((directory) => {
      // Add the configuration directory as a source.
      this.sources.push({ directory, root: directory });

      if (typeof sources[directory] === 'undefined' || !Array.isArray(sources[directory])) {
        return;
      }

      (sources[directory] as (string | Source)[]).forEach((item) => {
        if (typeof item === 'string') {
          this.sources.push({ directory: item, root: directory });
        } else {
          sourcesToResolve.push(item);
        }
      });
    });

    // Resolve all sources including git/github to directory sources.
    this.sources.push(
      ...await Promise.all(sourcesToResolve.map(resolveSourceToDirectory))
        .then((resolved) => resolved.filter((source) => source !== null) as DirectorySource[]),
    );

    logger().debug(`Found ${this.sources.length} sources from the configuration store: ${JSON.stringify(this.sources, null, 2)}`);
  }

  /**
   * Load the features from the sources.
   */
  public async loadFeaturesFromSources() {
    const files = await Promise.all(
      this.sources.map(({ directory, root = undefined }) => fg.glob(`${directory}/*/config.yml`, {
        absolute: true,
        cwd: root,
        ignore: [
          '**/.scaffolder/config.yml',
        ],
      })),
    )
      // Flatten the file index and remove duplicates.
      .then((item) => item.flat().filter((file, index, arr) => arr.indexOf(file) === index));

    logger().debug(`Found ${files.length} feature configuration files.`);

    const features = await Promise.all(
      files.map(async (file) => { // eslint-disable-line consistent-return
        logger().debug(`Parsing feature configuration file: ${chalk.yellow(file)}`);

        let config: FeatureConfig;

        try {
          config = await parseYamlFile<FeatureConfig>(file);
        } catch (error: any) {
          logger().warn(`Error parsing feature configuration file and is not being loaded: ${chalk.yellow(file)}: ${error.message}`);
          return null;
        }

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

        // Default the feature type to a file feature.
        if (!config.type) {
          config.type = 'file';
        }

        this.add(path.dirname(file), config);

        return config;
      }),
    )
      .then((items) => items.filter((feature) => feature !== null)) as FeatureConfig[];

    logger().debug(`Loaded ${features.length} features from sources.`);
  }
}

let store: FeatureStore | undefined;

/**
 * Get the feature store.
 */
export function getFeatureStore(): FeatureStore {
  if (!store) {
    throw new Error('Feature store has not been initialized.');
  }

  return store;
}

/**
 * Initialize the feature store.
 *
 * Discovers all configured features, sources, and features from said sources.
 */
export async function initializeFeatureStore(configStore: ConfigurationStore = getConfigurationStore()) {
  store = new FeatureStore(configStore);

  try {
    await store.initialize();
  } catch (error: any) {
    logger().error(`Error initializing feature store: ${error.message}`);
  }
}

/**
 * Clear the feature store.
 */
export function clearFeatureStore() {
  store = undefined;
}
