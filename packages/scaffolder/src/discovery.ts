/* eslint-disable import/prefer-default-export */

import fs from 'fs';
import { parse } from 'yaml';
import { Feature } from './types.js';

/**
 * Functionality to aid in the discovery of templates that can be used to
 * generate code.
 *
 * Out of the box we'll look for templates in the current folder and all the
 * parent directories. The end goal is to add the ability to look for templates
 * in a shared remote resource like a git repository.
 */

/**
 * Locate the template directory, recursively searching up the directory tree
 * until a template directory is found.
 *
 * A template directory is defined as a directory that contains a `.scaffolder`
 * directory.
 */
export async function locateScaffolderRoot() {
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

    currentDirectory = fs.realpathSync(`${currentDirectory}/..`);

    // Stop at the root directory.
    if (currentDirectory === '/') {
      break;
    }
  }

  return null;
}

/**
 * Parse the YAML configuration file of a scaffolder feature.
 */
export async function parseConfiguration(filePath: string) {
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
 * Discover features that are defined in the scaffolder root directory that can
 * be discovered and used.
 *
 * Features are defined as one-level subdirectories of the scaffolder root
 * directory and contain a `config.yml` file.
 */
export async function discoverFeatures(rootDirectory: string): Promise<Feature[]> {
  const scaffolderDirectory = `${rootDirectory}/.scaffolder`;

  if (!fs.existsSync(rootDirectory) || !fs.existsSync(scaffolderDirectory)) {
    return [];
  }

  const features = await fs.promises.readdir(scaffolderDirectory, {
    recursive: false,
    withFileTypes: true,
  });

  const availableFeatures = features
    .filter((feature) => feature.isDirectory())
    .filter((feature) => fs.existsSync(`${scaffolderDirectory}/${feature.name}/config.yml`));

  // Read the configuration from each feature.
  return Promise.all(availableFeatures.map(async (feature) => {
    const config = await parseConfiguration(`${scaffolderDirectory}/${feature.name}/config.yml`);

    if (!config.name) {
      throw new Error(`The feature "${scaffolderDirectory}/${feature.name}" does not have a name defined in the config.yml file.`);
    }

    return {
      config,
      name: config.name,
      path: `${scaffolderDirectory}/${feature.name}`,
    };
  }));
}
