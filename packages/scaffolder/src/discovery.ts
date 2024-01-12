/* eslint-disable import/prefer-default-export */

import fs from 'fs';
import { parse } from 'yaml';

import { exitError } from './error';

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
 * until a template directory is found. A template directory is defined as a
 * directory that contains a `.scaffolder` directory.
 */
export async function locateScaffolderRoot() {
  // Recursively search up the directory tree until a template directory is
  // found. Ensure that we eventually stop at the root directory.
  let currentDirectory = process.cwd();

  while (true) { // eslint-disable-line no-constant-condition
    if (fs.existsSync(`${currentDirectory}/.scaffolder`)) {
      return `${currentDirectory}/.scaffolder`;
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
export async function discoverFeatures(rootDirectory: string) {
  if (!fs.existsSync(rootDirectory)) {
    return [];
  }

  const features = await fs.promises.readdir(rootDirectory, {
    recursive: false,
    withFileTypes: true,
  });

  const availableFeatures = features
    .filter((feature) => feature.isDirectory())
    .filter((feature) => fs.existsSync(`${rootDirectory}/${feature.name}/config.yml`));

  // Read the configuration from each feature.
  return Promise.all(availableFeatures.map(async (feature) => {
    const config = await parseConfiguration(`${rootDirectory}/${feature.name}/config.yml`);

    if (!config.name) {
      exitError(`The feature "${rootDirectory}/${feature.name}" does not have a name defined in the config.yml file.`); // eslint-disable-line max-len
    }

    return {
      config,
      name: config.name,
      path: `${rootDirectory}/${feature.name}`,
    };
  }));
}
