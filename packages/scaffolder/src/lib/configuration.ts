import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
import { uniq } from 'lodash';

import { DEFAULT_CONFIGURATION } from './defaultConfiguration';
import { logger } from './logger';
import type { Configuration } from '../types';
import { parseYamlFile, validateConfiguration } from './yaml';

let projectDirectory: string | undefined;

/**
 * Locate the scaffolder project directory, recursively searching up the
 * directory tree until a template directory is found.
 *
 * The scaffolder project directory is defined as a directory that **contains**
 * a `.scaffolder` directory. The `.scaffolder/config.yml` file is optional.
 *
 * @see getProjectScaffolderDirectory() to retrieve the scaffolder directory.
 *
 * @param {String} directory The root directory to set as the scaffolder project
 *                           directory,  optional.
 */
export function getProjectDirectory(directory?: string) {
  // Set the root directory if it has been passed as an argument.
  if (directory) {
    projectDirectory = directory;
  }

  if (typeof projectDirectory !== 'undefined') {
    return projectDirectory;
  }

  // Recursively search up the directory tree until a template directory is
  // found. Ensure that we eventually stop at the root directory.
  let currentDirectory = process.cwd();

  while (true) { // eslint-disable-line no-constant-condition
    if (fs.existsSync(`${currentDirectory}/.scaffolder`)) {
      projectDirectory = currentDirectory;

      return projectDirectory;
    }

    if (!fs.existsSync(currentDirectory)) {
      break;
    }

    currentDirectory = path.resolve(currentDirectory, '..');

    // Stop at the root directory.
    if (currentDirectory === '/') {
      break;
    }
  }

  logger().info('No configuration found, using current directory as root.');
  logger().info(chalk.italic(chalk.blueBright('Use the --root option to specify a different project directory or create a .scaffolder directory in the current/parent directory.')));

  projectDirectory = process.cwd();

  return projectDirectory;
}

/**
 * Get the project scaffolder directory.
 *
 * This is the directory that contains the scaffolder configuration and
 * templates.
 */
export function getProjectScaffolderDirectory() {
  return `${getProjectDirectory()}/.scaffolder`;
}

/**
 * Clear the project directory.
 *
 * Used only for testing.
 */
export function clearProjectDirectory() {
  projectDirectory = undefined;
}

/**
 * Get the global configuration directory for the scaffolder.
 *
 * By default this is located at `~/.scaffolder`.
 */
export function getGlobalDirectory(): string {
  return process.env.SCAFFOLDER_HOME || `${process.env.HOME}/.scaffolder`;
}

let globalConfiguration: Configuration | undefined;

/**
 * Retrieve the global configuration for the scaffolder.
 */
export function getGlobalConfiguration(): Configuration {
  if (!globalConfiguration) {
    const globalConfigDir = getGlobalDirectory();

    try {
      if (!globalConfiguration && fs.existsSync(`${globalConfigDir}/config.yml`)) {
        globalConfiguration = parseYamlFile<Configuration>(`${globalConfigDir}/config.yml`);
      } else if (!globalConfiguration) {
        globalConfiguration = {};
      }
    } catch (err: any) {
      logger().error(`Failed to parse global configuration: ${err.message}`);
      process.exit(1);
    }

    validateConfiguration(globalConfiguration);
  }

  // Merge the default configuration with the global configuration.
  // Using lodash's merge method didn't work as expected so we use a custom
  // implementation with lodash uniq.
  globalConfiguration = {
    ...DEFAULT_CONFIGURATION,
    sources: uniq([
      ...DEFAULT_CONFIGURATION.sources || [],
      ...globalConfiguration.sources || [],
    ]),
    features: uniq([
      ...DEFAULT_CONFIGURATION.features || [],
      ...globalConfiguration.features || [],
    ]),
  };

  return globalConfiguration;
}

let projectConfiguration: Configuration | undefined;

/**
 * Retrieve the project configuration for the scaffolder.
 */
export function getProjectConfiguration(): Configuration {
  if (projectConfiguration) {
    return projectConfiguration;
  }

  const rootDirectory = getProjectDirectory();

  try {
    if (!projectConfiguration && fs.existsSync(`${rootDirectory}/.scaffolder/config.yml`)) {
      projectConfiguration = parseYamlFile<Configuration>(`${rootDirectory}/.scaffolder/config.yml`) || {};
    } else if (!projectConfiguration) {
      projectConfiguration = {};
    }

    validateConfiguration(projectConfiguration);
  } catch (err: any) {
    logger().error(`Failed to retrieve project configuration: ${err.message}`);
    process.exit(1);
  }

  return projectConfiguration;
}

/**
 * Reset the configuration to allow the configuration to be reloaded.
 *
 * Used only for testing.
 */
export function resetConfiguration(
  newGlobalConfiguration: Configuration | undefined = undefined,
  newConfiguration: Configuration | undefined = undefined,
) {
  globalConfiguration = newGlobalConfiguration;
  projectConfiguration = newConfiguration;
}
