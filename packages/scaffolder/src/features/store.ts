/* eslint-disable max-len */

import { ConfigurationStore, getConfigurationStore } from '../configuration';
import { logger } from '../logger';
import type { FeatureConfig, Source } from '../types';
import { resolveSourceToDirectory } from './sources';

class FeatureStore {
  private config: ConfigurationStore;

  private readonly features: Record<string, FeatureConfig[]> = {};

  private readonly sources: Source[] = [];

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
    await this.loadFeaturesFromSources();
    console.log('done with loadFeaturesFromSources');

    logger().debug(`${Object.values(this.all()).flat().length} features loaded.`);
  }

  /**
   * Add features to the store.
   */
  public add(directory: string, features: FeatureConfig[] | FeatureConfig): void {
    if (!this.features[directory]) {
      this.features[directory] = [];
    }

    if (Array.isArray(features)) {
      this.features[directory].push(...features);
    } else {
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
  public async loadFeaturesFromSources() {
    // Sources are the configured sources in each configuration file and the
    // directory of the configuration file.
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

    this.sources.push(
      ...await Promise.all(sourcesToResolve.map(resolveSourceToDirectory)),
    );

    logger().debug(`Loaded ${this.sources.length} sources from the configuration store: ${JSON.stringify(this.sources, null, 2)}`);

    // Discover all features from the configured sources.
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
