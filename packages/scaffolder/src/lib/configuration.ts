import { parse } from 'yaml';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

import type { Configuration } from '../types';
import { logger } from './logger';

export const DEFAULT_CONFIGURATION = typeof jest === 'undefined' ? {
  sources: [],
} : {
  sources: [
    {
      root: path.resolve(__dirname, '../..'),
      directory: './__tests__/fixtures/a-features',
    },
  ],
};

/**
 * Validate the configuration to ensure that it meets our expected format.
 *
 * This is used for both the global and project configuration but not the
 * feature configuration.
 */
export function validateConfiguration<TData extends object>(config: TData): void {
  const allowedKeys = Object.keys(DEFAULT_CONFIGURATION);

  // Ensure that the configuration only contains allowed keys.
  Object.keys(config).forEach((key) => {
    if (!allowedKeys.includes(key)) {
      throw new Error(`The configuration contains an unknown root key: ${key}`);
    }
  });

  // Ensure that the sources are valid.
  const { sources = [] } = config as any;

  if (!Array.isArray(sources)) {
    throw new Error('The sources key must be an array.');
  }

  sources.forEach((source: any) => {
    if (typeof source === 'string') {
      return;
    }

    if (typeof source === 'object') {
      if ('directory' in source || 'github' in source || 'git' in source) {
        return;
      }
    }

    throw new Error(`The source contains an unknown format: ${chalk.yellow(JSON.stringify(source))}`);
  });
}

/**
 * Validate the configuration for a feature.
 */
export function validateFeatureConfiguration(config: object): void {
  const schema = {
    files: 'object', // This really is an array of objects.
    inputs: 'object',
    name: 'string',
  };

  Object.keys(schema).forEach((key) => {
    // Ignore if the key is not in the schema.
    if (!(key in config)) {
      return;
    }

    const { [key as keyof typeof config]: value } = config;

    if (typeof value !== schema[key as keyof typeof schema]) {
      throw new Error(`The feature configuration contains an invalid "${key}" key. Expected "${schema[key as keyof typeof schema]}" but got "${typeof value}".`);
    }
  });
}

/**
 * Parse the YAML configuration file of a scaffolder feature.
 */
export async function parseConfiguration<TData extends object>(filePath: string): Promise<TData> {
  // Ensure this is a YAML file.
  if (!filePath.endsWith('.yml')) {
    throw new Error('The configuration file must be a YAML file.');
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`The configuration file does not exist: ${filePath}`);
  }

  return parse(fs.readFileSync(filePath, 'utf8')) as TData;
}

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
      globalConfiguration = await parseConfiguration<Configuration>(`${globalConfigDir}/config.yml`);
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
      projectConfiguration = await parseConfiguration<Configuration>(`${rootDirectory}/.scaffolder/config.yml`);
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
