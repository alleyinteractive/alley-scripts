import fs from 'fs';
import path from 'path';
import { parse } from 'yaml';

import type { RootConfiguration } from '../types';
import { resolvePath } from '../helpers';

export const DEFAULT_CONFIGURATION = typeof jest === 'undefined' ? {
  sources: [],
} : {
  sources: ['./default-configuration'],
};

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

  return parse(fs.readFileSync(filePath, 'utf8'));
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

let globalConfiguration: RootConfiguration | null;

/**
 * Retrieve the global configuration for the scaffolder.
 */
export async function getGlobalConfiguration() {
  const globalConfigDir = getGlobalConfigurationDir();

  if (!globalConfiguration && fs.existsSync(`${globalConfigDir}/config.yml`)) {
    globalConfiguration = await parseConfiguration<RootConfiguration>(`${globalConfigDir}/config.yml`);
  } else if (!globalConfiguration) {
    globalConfiguration = {};
  }

  // Merge the default configuration with the global configuration
  // non-recursively. This allows the configuration to be completely overridden.
  globalConfiguration = {
    ...DEFAULT_CONFIGURATION,
    ...globalConfiguration,
  };

  // Ensure that the sources are absolute paths.
  globalConfiguration.sources = globalConfiguration.sources?.map(
    (source) => resolvePath(globalConfigDir, source),
  );

  return globalConfiguration;
}

let projectConfiguration: RootConfiguration | null;

/**
 * Get the root configuration for the scaffolder from the project.
 *
 * This is an optional file and is located at `.scaffolder/config.yml`.
 */
export async function getProjectConfiguration(rootDirectory: string) {
  if (!projectConfiguration && fs.existsSync(`${rootDirectory}/.scaffolder/config.yml`)) {
    projectConfiguration = await parseConfiguration<RootConfiguration>(`${rootDirectory}/.scaffolder/config.yml`);
  } else if (!projectConfiguration) {
    projectConfiguration = {};
  }

  await getGlobalConfiguration();

  // Merge the project configuration with the global configuration recursively.
  projectConfiguration = {
    ...globalConfiguration,
    ...projectConfiguration,
    sources: [
      ...(globalConfiguration?.sources || []),
      ...(projectConfiguration?.sources || []).map((source) => resolvePath(rootDirectory, source)),
    ],
  };

  return projectConfiguration;
}

/**
 * Reset the configuration to allow the configuration to be reloaded.
 */
export function resetConfiguration(
  newGlobalConfiguration: RootConfiguration | null = null,
  newProjectConfiguration: RootConfiguration | null = null,
) {
  globalConfiguration = newGlobalConfiguration;
  projectConfiguration = newProjectConfiguration;
}
