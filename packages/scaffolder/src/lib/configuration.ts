import fs from 'fs';
import { parse } from 'yaml';

import type { RootConfiguration } from '../types';

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
  if (!globalConfiguration && fs.existsSync(`${getGlobalConfigurationDir()}/config.yml`)) {
    globalConfiguration = await parseConfiguration<RootConfiguration>(`${getGlobalConfigurationDir()}/config.yml`);
  } else if (!globalConfiguration) {
    globalConfiguration = {};
  }

  // Merge the default configuration with the global configuration
  // non-recursively. This allows the configuration to be completely overridden.
  globalConfiguration = {
    ...DEFAULT_CONFIGURATION,
    ...globalConfiguration,
  };

  return globalConfiguration;
}

let rootConfiguration: RootConfiguration | null;

/**
 * Get the root configuration for the scaffolder from the project.
 *
 * This is an optional file and is located at `.scaffolder/config.yml`.
 */
export async function getProjectConfiguration(rootDirectory: string) {
  if (!rootConfiguration && fs.existsSync(`${rootDirectory}/.scaffolder/config.yml`)) {
    rootConfiguration = await parseConfiguration<RootConfiguration>(`${rootDirectory}/.scaffolder/config.yml`);
  } else if (!rootConfiguration) {
    rootConfiguration = {};
  }

  await getGlobalConfiguration();

  // Merge the project configuration with the global configuration recursively.
  rootConfiguration = {
    ...(globalConfiguration || {}),
    ...(rootConfiguration || {}),
    sources: [
      ...(globalConfiguration?.sources || []),
      ...(rootConfiguration?.sources || []),
    ],
  };

  return rootConfiguration;
}

/**
 * Reset the configuration to allow the configuration to be reloaded.
 */
export function resetConfiguration() {
  globalConfiguration = null;
  rootConfiguration = null;
}
