import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';

// Services.
import { logger } from '../logger';
import { parseYamlFile, validateConfiguration } from '../yaml';
import { getGlobalDirectory } from './globalDirectory';

// Types.
import type { Configuration } from '../types/config';

/**
 * Storage of the configurations of the application.
 *
 * Configurations are loaded in a cascading manner from the current working directory.
 */
export class ConfigurationStore {
  /**
   * Configurations that can be loaded.
   *
   * The key is the path to the .scaffolder directory and the value is the
   * parsed configuration file (if any).
   */
  private readonly configurations: Record<string, Configuration> = {};

  /**
   * Add a configuration to the store with the path it was loaded from.
   */
  public add(directory: string, source: Configuration) {
    this.configurations[directory] = source;
  }

  /**
   * Retrieve a configuration from the store by its path.
   */
  public get(directory: string): Configuration | undefined {
    return this.configurations[directory] || undefined;
  }

  /**
   * Retrieve a sub-configuration from each configuration in the store, keyed by
   * the directory it was loaded from.
   */
  public pluck<TKey extends keyof Configuration>(key: TKey): Record<string, Configuration[TKey]> {
    const plucked: Record<string, Configuration[TKey]> = {};

    Object.entries(this.configurations).forEach(([directory, configuration]) => {
      plucked[directory] = configuration[key] || undefined;
    });

    return plucked;
  }

  /**
   * Get all configurations in the store.
   */
  public all(): Record<string, Configuration> {
    return this.configurations;
  }

  /**
   * Load configurations from the given path and ascend the directory tree.
   */
  public loadFromPath(directory: string): void {
    logger().debug(`Loading configurations from ${chalk.blue(directory)}`);

    // Recursively search up the directory tree for all .scaffolder directories.
    let currentDirectory = directory;

    while (true) { // eslint-disable-line no-constant-condition
      if (fs.existsSync(path.join(currentDirectory, '.scaffolder'))) {
        try {
          const configuration = fs.existsSync(path.join(currentDirectory, '.scaffolder', 'config.yml'))
            ? (parseYamlFile(path.join(currentDirectory, '.scaffolder', 'config.yml')) || {})
            : {};

          validateConfiguration(configuration);

          this.add(path.join(currentDirectory, '.scaffolder'), configuration);
        } catch (error: any) {
          logger().error(`Error loading configuration from ${chalk.yellow(path.join(currentDirectory, '.scaffolder', 'config.yml'))}: ${chalk.red(error.message)}`);
        }
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

    this.ensureGlobalConfigurationLoaded();

    logger().debug(`Loaded ${chalk.blue(Object.keys(this.configurations).length)} configurations.`);
  }

  /**
   * Ensure the global configuration is always loaded.
   */
  private ensureGlobalConfigurationLoaded() {
    const globalConfigurationDirectory = getGlobalDirectory();

    // Ensure the global configuration is loaded if it wasn't already.
    if (typeof this.configurations[globalConfigurationDirectory] === 'undefined') {
      try {
        const globalConfiguration = fs.existsSync(path.join(globalConfigurationDirectory, 'config.yml'))
          ? (parseYamlFile(path.join(globalConfigurationDirectory, 'config.yml')) || {})
          : {};

        try {
          validateConfiguration(globalConfiguration);

          this.add(globalConfigurationDirectory, globalConfiguration);
        } catch (error: any) {
          logger().error(`Error loading global configuration from ${chalk.yellow(path.join(globalConfigurationDirectory, 'config.yml'))}: ${chalk.red(error.message)}`);
        }
      } catch (error: any) {
        logger().error(`Error loading global configuration: ${chalk.red(error.message)}`);
      }

      logger().debug(`Loaded global configuration from ${chalk.blue(globalConfigurationDirectory)}`);
    }
  }
}

let store: ConfigurationStore | undefined;

/**
 * Get the configuration store.
 */
export function getConfigurationStore(): ConfigurationStore {
  if (!store) {
    throw new Error('Configuration store has not been initialized.');
  }

  return store;
}

/**
 * Initialize the configuration store.
 */
export function initializeConfigurationStore(rootPath: string) {
  store = new ConfigurationStore();

  store.loadFromPath(rootPath);

  logger().debug(`Initialized configuration store with ${chalk.blue(JSON.stringify(store.all(), null, 2))}`);
}

/**
 * Clear the configuration store.
 */
export function clearConfigurationStore() {
  store = undefined;
}
