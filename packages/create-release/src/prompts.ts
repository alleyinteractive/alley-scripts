import prompts from 'prompts';
import { valid } from 'semver';

import {
  ReleaseType,
} from './options.js';

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
  promptForReleaseType,
  promptForReleaseVersion,
};
