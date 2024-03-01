/* eslint-disable max-len */

import chalk from 'chalk';
import fg from 'fast-glob';
import { compact, uniq } from 'lodash';
import fs from 'node:fs';
import path from 'node:path';

// Services.
import { ConfigurationStore, getConfigurationStore } from '../configuration';
import { logger } from '../logger';
import { resolveSourceToDirectory } from './sources';
import { parseYamlFile, validateFeatureConfiguration } from '../yaml';

// Types.
import type { DirectorySource, FeatureConfig, Source } from '../types';

/**
 * Feature Store
 */
export class FeatureStore {
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
    await this.loadSourcesFromStore();

    this.loadDefinedFeaturesFromStore();

    await Promise.all([
      this.loadFeaturesFromSources(),
      this.loadFromNodeModules(),
    ]);

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
   * Load the sources from the configuration.
   *
   * These exist as a top-level "sources" key on each configuration file.
   */
  private async loadSourcesFromStore() {
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
        .then((resolved) => resolved.filter((source): source is DirectorySource => source !== null)),
    );

    logger().debug(`Found ${this.sources.length} sources from the configuration store: ${JSON.stringify(this.sources, null, 2)}`);
  }

  /**
   * Load a set of configuration files.
   */
  private async loadConfigurationFiles(files: string[]) {
    return Promise.all(
      files.map((file) => this.loadConfigurationFile(file)),
    )
      .then((items) => items.filter((feature): feature is FeatureConfig => feature !== null));
  }

  /**
   * Load a feature configuration file from the file system.
   */
  private async loadConfigurationFile(filePath: string) {
    logger().debug(`Parsing feature configuration file: ${chalk.yellow(filePath)}`);

    let config: FeatureConfig;

    try {
      config = await parseYamlFile<FeatureConfig>(filePath);
    } catch (error: any) {
      logger().warn(`Error parsing feature configuration file and is not being loaded: ${chalk.yellow(filePath)}: ${error.message}`);
      return null;
    }

    try {
      validateFeatureConfiguration(config);
    } catch (err: any) {
      logger().warn(`The feature "${chalk.italic(filePath)}" is invalid and is not being loaded: ${chalk.yellow(err.message)}\n`);
      return null;
    }

    if (!config.name) {
      logger().warn(`The feature "${chalk.yellow(filePath)}" does not have a name defined in the config.yml file. Using the directory name as the feature name.`);

      // Use the directory name as the feature name.
      config.name = path.basename(path.dirname(filePath));
    }

    // Default the feature type to a file feature.
    if (!config.type) {
      config.type = 'file';
    }

    this.add(path.dirname(filePath), config);

    return config;
  }

  /**
   * Find and load the features from the sources defined in each configuration file.
   */
  private async loadFeaturesFromSources() {
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

    const features = await this.loadConfigurationFiles(files);

    logger().debug(`Loaded ${features.length} features from sources.`);
  }

  /**
   * Load configurations from all available node modules.
   */
  private async loadFromNodeModules() {
    const paths = uniq(
      FeatureStore.getLocalNpmPaths().concat(FeatureStore.getGlobalNpmPaths()),
    );

    if (!paths.length) {
      logger().debug('No NPM paths found to load configurations from.');

      return;
    }

    logger().debug(`Loading configurations from NPM paths: ${chalk.blue(paths.join(', '))}`);

    const features = await Promise.all(
      paths.map((nodeModulesPath) => fg.glob(
        [
          // Same-level (e.g. scaffolder/config.yml)
          'scaffolder/*/config.yml',
          // One-level (e.g. package/scaffolder/<feature>/config.yml)
          '*/scaffolder/*/config.yml',
          // Two-level (e.g. @organization/package/scaffolder/<feature>/config.yml)
          '*/*/scaffolder/*/config.yml',
        ],
        {
          cwd: nodeModulesPath,
          absolute: true,
        },
      ).catch(() => [])),
    )
      .then((item) => item.flat().filter((file, index, arr) => arr.indexOf(file) === index))
      .then((files) => this.loadConfigurationFiles(files));

    logger().debug(`Loaded ${features.length} features from NPM paths.`);
  }

  /**
   * Retrieve all node_modules paths in the current directory and its ancestors.
   */
  private static getLocalNpmPaths(): string[] {
    const paths: string[] = [];

    // Retrieve the path to the node_modules using a known package.
    const resolvedNodeModulesPath = require.resolve('chalk').match(/(.*node_modules)/)?.[0];

    if (resolvedNodeModulesPath && fs.existsSync(resolvedNodeModulesPath)) {
      paths.push(resolvedNodeModulesPath);
    }

    let currentDirectory = process.cwd();

    while (true) { // eslint-disable-line no-constant-condition
      const nodeModulesPath = path.join(currentDirectory, 'node_modules');

      if (fs.existsSync(nodeModulesPath)) {
        paths.push(nodeModulesPath);
      }

      // Break if the directory doesn't exist.
      if (!fs.existsSync(currentDirectory)) {
        break;
      }

      currentDirectory = path.resolve(currentDirectory, '..');

      // Stop at the root directory supporting Windows and Unix-like systems.
      if (currentDirectory === '/' || currentDirectory.match(/^[A-Z]:\\$/)) {
        break;
      }
    }

    // Check if we're developing on the scaffolder locally.
    if (__dirname.includes('packages/scaffolder')) {
      const projectRoot = path.join(__dirname, '..', '..');

      if (fs.existsSync(path.join(projectRoot, '..', 'scaffolder-features'))) {
        paths.push(path.join(projectRoot, '..', 'scaffolder-features'));
      }
    }

    return uniq(paths);
  }

  /**
   * Load configurations from globally installed node modules.
   *
   * Credits to yeoman for the original implementation.
   */
  private static getGlobalNpmPaths(): string[] {
    let paths: string[] = [];

    // Default paths for each system
    if (process.env.NVM_HOME) {
      paths.push(path.join(process.env.NVM_HOME, process.version, 'node_modules'));
    } else if (process.env.NVM_BIN) {
      paths.push(
        path.join(process.env.NVM_BIN, '..', 'lib', 'node_modules'),
      );
    } else if (process.platform === 'win32' && process.env.APPDATA) {
      paths.push(path.join(process.env.APPDATA, 'npm/node_modules'));
    } else {
      paths.push('/usr/lib/node_modules', '/usr/local/lib/node_modules');
    }

    // Add NVM prefix directory
    if (process.env.NVM_PATH) {
      paths.push(path.join(path.dirname(process.env.NVM_PATH), 'node_modules'));
    }

    // Adding global npm directories.
    if (process.env.NODE_PATH) {
      paths = compact(process.env.NODE_PATH.split(path.delimiter)).concat(paths);
    }

    // Use the NPM config/exec paths to infer the global module paths.
    if (process.env.npm_config_prefix) {
      paths.push(path.join(process.env.npm_config_prefix, 'lib', 'node_modules'));
    }

    if (process.env.npm_execpath) {
      paths.push(path.join(path.dirname(process.env.npm_execpath), '..', 'lib', 'node_modules'));
      paths.push(path.join(path.dirname(process.env.npm_execpath), '..', 'node_modules'));
    }

    return uniq(paths.filter((p) => fs.existsSync(p)));
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
export async function initializeFeatureStore(
  configStore: ConfigurationStore = getConfigurationStore(),
) {
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
