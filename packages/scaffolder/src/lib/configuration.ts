import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';

import { DEFAULT_CONFIGURATION } from './defaultConfiguration';
import { logger } from './logger';
import type { Configuration } from '../types';
import { parseYamlFile, validateConfiguration } from './yaml';

let scaffolderRooter: string | undefined;

/**
 * Locate the scaffolder root, recursively searching up the directory tree until
 * a template directory is found.
 *
 * The scaffolder root directory is defined as a directory that contains a
 * `.scaffolder` directory. The `.scaffolder/config.yml` file is optional.
 *
 * @param {String} rootDir The root directory to set as the scaffolder root.
 */
export function getRootDirectory(rootDir?: string) {
  if (rootDir) {
    scaffolderRooter = rootDir;
  }

  if (typeof scaffolderRooter !== 'undefined') {
    return scaffolderRooter;
  }

  // Recursively search up the directory tree until a template directory is
  // found. Ensure that we eventually stop at the root directory.
  let currentDirectory = process.cwd();

  while (true) { // eslint-disable-line no-constant-condition
    if (fs.existsSync(`${currentDirectory}/.scaffolder`)) {
      scaffolderRooter = currentDirectory;

      return currentDirectory;
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
  logger().info(chalk.italic(chalk.blueBright('Use the --root option to specify a different root directory or create a .scaffolder directory in the current/parent directory.')));

  scaffolderRooter = process.cwd();

  return scaffolderRooter;
}

/**
 * Get the global configuration directory for the scaffolder.
 *
 * By default this is located at `~/.scaffolder`.
 */
export function getGlobalDirectory(): string {
  return process.env.SCAFFOLDER_HOME || `${process.env.HOME}/.scaffolder`;
}

let globalConfiguration: Configuration | null;

/**
 * Retrieve the global configuration for the scaffolder.
 */
export function getGlobalConfiguration(): Configuration {
  const globalConfigDir = getGlobalDirectory();

  try {
    if (!globalConfiguration && fs.existsSync(`${globalConfigDir}/config.yml`)) {
      globalConfiguration = parseYamlFile<Configuration>(`${globalConfigDir}/config.yml`);
    } else if (!globalConfiguration) {
      globalConfiguration = {};
    }

    validateConfiguration(globalConfiguration);
  } catch (err: any) {
    logger().error(`Failed to parse global configuration: ${err.message}`);
    process.exit(1);
  }

  // Merge the default configuration with the global configuration.
  globalConfiguration = {
    ...DEFAULT_CONFIGURATION,
    ...globalConfiguration,
    sources: [
      ...DEFAULT_CONFIGURATION.sources,
      ...(globalConfiguration.sources || []),
    ].filter(
      // Filter out duplicate sources.
      (source, index, sources) => sources.findIndex(
        (s) => JSON.stringify(s) === JSON.stringify(source),
      ) === index,
    ),
  };

  return globalConfiguration;
}

let projectConfiguration: Configuration | null;

/**
 * Retrieve the root and project configuration.
 */
export function getConfiguration(): {
  root: {
    location: string,
    config: Configuration | undefined;
  },
  project: {
    location: string;
    config: Configuration | undefined;
  },
} {
  const rootDirectory = getRootDirectory();

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

  return {
    root: {
      location: getGlobalDirectory(),
      config: getGlobalConfiguration(),
    },
    project: {
      location: `${rootDirectory}/.scaffolder`,
      config: projectConfiguration,
    },
  };
}

/**
 * Reset the configuration to allow the configuration to be reloaded.
 *
 * Used only for testing.
 */
export function resetConfiguration(
  newGlobalConfiguration: Configuration | null = null,
  newConfiguration: Configuration | null = null,
) {
  globalConfiguration = newGlobalConfiguration;
  projectConfiguration = newConfiguration;
}
