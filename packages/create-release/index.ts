#!/usr/bin/env node
/* eslint-disable no-console */

import prompts from 'prompts';
import chalk from 'chalk';
import { lt, valid } from 'semver';

import {
  promptForReleaseType,
  promptForReleaseVersion,
} from './src/prompts.js';
import entryArgs from './src/entryArgs.js';
import { ReleaseType } from './src/options.js';
import {
  bumpVersion,
  exitError,
  getCurrentVersion,
  getReleaseType,
  upgradeComposerVersion,
  upgradePluginVersion,
  upgradeReadmeVersion,
} from './src/helpers.js';

/**
 * Prompts the user to create a release.
 */
(async () => {
  const basePath = process.cwd();

  const {
    'dry-run': dryRun = false,
  } = entryArgs;

  if (dryRun) {
    console.log(chalk.yellow('Dry Run: No changes will be made.'));
  }

  const currentVersion = getCurrentVersion(basePath);

  if (currentVersion) {
    console.log(`Current Plugin Version: ${chalk.yellow(currentVersion)}`);
  } else {
    console.log('No current plugin version found.');
  }

  let releaseVersion: string = '';
  let releaseType: ReleaseType | undefined;

  // Validate the arguments passed to the CLI.
  if (entryArgs.version) {
    // Validate that the passed version number is a valid semver version number.
    if (!valid(entryArgs.version)) {
      exitError(
        `The version number provided is not a valid semver version number. Received: ${entryArgs.version}`, // eslint-disable-line max-len
      );
    }

    // Validate that the passed version number is not the same as the current
    // version.
    if (currentVersion && entryArgs.version === currentVersion) {
      exitError(
        `The version number provided is the same as the current version number. Received: ${entryArgs.version}`, // eslint-disable-line max-len
      );
    }

    // Validate that the passed version number is greater than the current version.
    if (currentVersion && lt(entryArgs.version, currentVersion)) {
      exitError(
        `The version number provided is less than the current version number. Received: ${entryArgs.version}`, // eslint-disable-line max-len
      );
    }

    releaseVersion = entryArgs.version;
  }

  // Set the release type if it is passed as an argument.
  if (entryArgs.major) {
    releaseType = 'major';
  } else if (entryArgs.minor) {
    releaseType = 'minor';
  } else if (entryArgs.patch) {
    releaseType = 'patch';
  }

  // Infer the release type from the version number and the current version.
  if (currentVersion && !releaseType) {
    releaseType = getReleaseType(currentVersion, releaseVersion);
  }

  // Prompt the user to select a release type if one is not provided.
  if (!releaseType) {
    releaseType = await promptForReleaseType();

    if (!releaseType) {
      process.exit(1);
    }
  }

  console.log(`Release Type: ${chalk.yellow(releaseType)}`);

  // If the release version is not defined, infer it from the release type.
  if (!releaseVersion) {
    releaseVersion = bumpVersion(currentVersion || '0.0.0', releaseType);
  }

  // Validate the version number with the user.
  if (!entryArgs.version || entryArgs.version !== releaseVersion) {
    releaseVersion = await promptForReleaseVersion(releaseVersion, currentVersion);

    if (!releaseVersion) {
      process.exit(1);
    }
  }

  // Ensure that the release version is valid before continuing.
  if (!releaseVersion || !valid(releaseVersion)) {
    exitError(
      `The version number provided is not a valid semver version number. Received: ${releaseVersion}`, // eslint-disable-line max-len
    );
  }

  // Confirm the user is OK with the release.
  const { confirmRelease } = await prompts({
    type: 'confirm',
    name: 'confirmRelease',
    message: `Are you sure you want to release version ${releaseVersion}?`,
    initial: true,
  });

  if (!confirmRelease) {
    process.exit(1);
  }

  // Update the version in Composer.json.
  if (dryRun) {
    console.log(`Would be updating "version" in ${chalk.yellow('composer.json')} to ${chalk.yellow(releaseVersion)}`);
  } else {
    upgradeComposerVersion(
      basePath,
      releaseVersion,
    );

    console.log(`Updated "version" in ${chalk.yellow('composer.json')} to ${chalk.yellow(releaseVersion)}`);
  }

  // Update the version in the plugin header.
  if (dryRun) {
    console.log(`Would be updating "Version" plugin header to ${chalk.yellow(releaseVersion)}`);
  } else {
    upgradePluginVersion(
      basePath,
      releaseVersion,
    );

    console.log(`Updated "Version" plugin header to ${chalk.yellow(releaseVersion)}`);
  }

  // Update the version in the README.md/README.txt.
  if (dryRun) {
    console.log(`Would be updating "Stable tag" in ${chalk.yellow('README.txt/md')} to ${chalk.yellow(releaseVersion)}`);
  } else {
    upgradeReadmeVersion(
      basePath,
      releaseVersion,
    );

    console.log(`Updated "Stable tag" in ${chalk.yellow('README.txt/md')} to ${chalk.yellow(releaseVersion)} if they exist.`);
  }

  if (dryRun) {
    process.exit(0);
  }

  console.log(`✅ Ready to release version ${chalk.yellow(releaseVersion)}!`);
  console.log('Commit the changes and the GitHub actions will handle creating a tag/release on GitHub.'); // eslint-disable-line max-len

  process.exit(0);
})();
