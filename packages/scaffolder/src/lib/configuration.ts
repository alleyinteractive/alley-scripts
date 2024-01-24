import fs from 'fs';
import path from 'path';

import { DEFAULT_CONFIGURATION } from './defaultConfiguration';
import { logger } from './logger';
import type { Configuration } from '../types';
import { parseYamlFile, validateConfiguration } from './yaml';

/**
 * Locate the scaffolder root, recursively searching up the directory tree until
 * a template directory is found.
 *
 * The scaffolder root directory is defined as a directory that contains a
 * `.scaffolder` directory. The `.scaffolder/config.yml` file is optional.
 */
export async function getScaffolderRoot() {
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

    currentDirectory = path.resolve(currentDirectory, '..');

    // Stop at the root directory.
    if (currentDirectory === '/') {
      break;
    }
  }

  return null;
}

/**
 * Get the global configuration directory for the scaffolder.
 *
 * By default this is located at `~/.scaffolder`.
 */
export function getGlobalConfigurationDir(): string {
  return process.env.SCAFFOLDER_HOME || `${process.env.HOME}/.scaffolder`;
}

let globalConfiguration: Configuration | null;

/**
 * Retrieve the global configuration for the scaffolder.
 */
export async function getGlobalConfiguration() {
  const globalConfigDir = getGlobalConfigurationDir();

  try {
    if (!globalConfiguration && fs.existsSync(`${globalConfigDir}/config.yml`)) {
      globalConfiguration = await parseYamlFile<Configuration>(`${globalConfigDir}/config.yml`);
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
 * Get the root configuration for the scaffolder from the project.
 *
 * This is an optional file and is located at `.scaffolder/config.yml`.
 */
export async function getProjectConfiguration(rootDirectory: string): Promise<{
  root: {
    location: string,
    config: Configuration | null;
  },
  project: {
    location: string;
    config: Configuration | null;
  },
}> {
  try {
    if (!projectConfiguration && fs.existsSync(`${rootDirectory}/.scaffolder/config.yml`)) {
      projectConfiguration = await parseYamlFile<Configuration>(`${rootDirectory}/.scaffolder/config.yml`);
    } else if (!projectConfiguration) {
      projectConfiguration = {};
    }

    validateConfiguration(projectConfiguration);
  } catch (err: any) {
    logger().error(`Failed to parse project configuration: ${err.message}`);
    process.exit(1);
  }

  return {
    root: {
      location: getGlobalConfigurationDir(),
      config: await getGlobalConfiguration(),
    },
    project: {
      location: `${rootDirectory}/.scaffolder`,
      config: projectConfiguration,
    },
  };
}

/**
 * Reset the configuration to allow the configuration to be reloaded.
 */
export function resetConfiguration(
  newGlobalConfiguration: Configuration | null = null,
  newProjectConfiguration: Configuration | null = null,
) {
  globalConfiguration = newGlobalConfiguration;
  projectConfiguration = newProjectConfiguration;
}
