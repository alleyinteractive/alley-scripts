import { valid } from 'semver';
import fs from 'fs';
import prompts from 'prompts';

import {
  ReleaseType,
} from './options.js';

/**
 * Prompt for a path to a plugin.
 */
async function promptForPluginPath(): Promise<string> {
  const { pluginPath } = await prompts([
    {
      type: 'text',
      name: 'pluginPath',
      message: 'What is the path to the plugin you want to release?',
      validate: (value: string) => {
        if (!value) {
          return 'You must provide a path to the plugin.';
        }

        return fs.existsSync(`${value}/composer.json`) ? true : 'The path provided is not a valid path to a plugin.'; // eslint-disable-line max-len
      },
    },
  ]);

  return pluginPath;
}

/**
 * Prompts the release type to use for the release.
 */
async function promptForReleaseType(): Promise<ReleaseType> {
  const { releaseType } = await prompts([
    {
      type: 'select',
      name: 'releaseType',
      choices: [
        { title: 'Major', value: 'major' },
        { title: 'Minor', value: 'minor' },
        { title: 'Patch', value: 'patch' },
      ],
      message: 'The release type to use for the release',
    },
  ]);

  return releaseType;
}

/**
 * Prompt the user to confirm the release version.
 */
async function promptForReleaseVersion(version: string, currentVersion?: string): Promise<string> {
  const { releaseVersion } = await prompts([
    {
      type: 'text',
      name: 'releaseVersion',
      message: 'The release version',
      initial: version,
      validate: (value: string) => {
        if (currentVersion && value === currentVersion) {
          return 'The version number provided is the same as the current version number.';
        }

        return valid(value) ? true : 'The version number provided is not a valid semver version number.'; // eslint-disable-line max-len
      },
    },
  ]);

  return releaseVersion;
}

export {
  promptForPluginPath,
  promptForReleaseType,
  promptForReleaseVersion,
};
