#!/usr/bin/env node
/* eslint-disable no-console, no-await-in-loop */

import { lt, valid } from 'semver';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import prompts from 'prompts';

import {
  promptForPluginPath,
  promptForReleaseType,
  promptForReleaseVersion,
} from './src/prompts.js';
import entryArgs from './src/entryArgs.js';
import { ReleaseType } from './src/options.js';
import {
  bumpVersion,
  exitError,
  getComposerVersion,
  getCurrentVersion,
  getNpmPackageVersion,
  getReleaseType,
  upgradeComposerVersion,
  upgradeNpmPackageVersion,
  upgradePluginVersion,
  upgradeReadmeVersion,
} from './src/helpers.js';
import promptToEditChangelog from './src/changelog.js';

/**
 * Prompts the user to create a release.
 */
(async () => {
  let basePath: string = entryArgs.path || process.cwd();
  const force = entryArgs.force || false;

  // Check if this is a valid path to a plugin.
  if (!fs.existsSync(`${basePath}/composer.json`)) {
    const pluginPath = await promptForPluginPath();

    if (!pluginPath) {
      process.exit(1);
    }

    basePath = path.resolve(pluginPath);

    console.log(`Using plugin path: ${chalk.yellow(basePath)}`);
  }

  const currentVersion = getCurrentVersion(basePath);

  const {
    'dry-run': dryRun = false,
    // Infer if we should update Composer/NPM by default if the current version
    // set in Composer/NPM is the same as the current version in the plugin
    // header. It can still be overridden by passing --composer=false or
    // --npm=false to prevent updating Composer/NPM.
    composer: updateComposer = currentVersion === getComposerVersion(basePath),
    npm: updateNpm = currentVersion === getNpmPackageVersion(basePath),
  } = entryArgs;

  if (dryRun) {
    console.log(chalk.yellow('Dry Run: No changes will be made.'));
  }

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
  if (!force && (!entryArgs.version || entryArgs.version !== releaseVersion)) {
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

  if (force) {
    console.log('Not confirming since --force was passed.');
  } else {
    const { confirmRelease } = await prompts({
      type: 'confirm',
      name: 'confirmRelease',
      message: `Are you sure you want to release version ${releaseVersion}?`,
      initial: true,
    });

    if (!confirmRelease) {
      process.exit(1);
    }
  }

  // Update the version in composer.json.
  if (updateComposer) {
    if (dryRun) {
      console.log(`Would be updating "version" in ${chalk.yellow('composer.json')} to ${chalk.yellow(releaseVersion)}`);
    } else {
      upgradeComposerVersion(
        basePath,
        releaseVersion,
      );

      console.log(`Updated "version" in ${chalk.yellow('composer.json')} to ${chalk.yellow(releaseVersion)}`);
    }
  }

  // Update the version in package.json.
  if (updateNpm) {
    if (dryRun) {
      console.log(`Would be updating "version" in ${chalk.yellow('package.json')} to ${chalk.yellow(releaseVersion)}`);
    } else {
      upgradeNpmPackageVersion(
        basePath,
        releaseVersion,
      );
    }
  }

  // Update the version in the plugin header.
  if (dryRun) {
    console.log(`Would be updating "Version" plugin header to ${chalk.yellow(releaseVersion)}`);
  } else {
    upgradePluginVersion(
      basePath,
      releaseVersion,
    );
  }

  // Update the version in the README.md/README.txt.
  if (dryRun) {
    console.log(`Would be updating "Stable tag" in ${chalk.yellow('README.txt/md')} to ${chalk.yellow(releaseVersion)}`);
  } else {
    upgradeReadmeVersion(
      basePath,
      releaseVersion,
    );
  }

  if (dryRun) {
    process.exit(0);
  }

  // Prompt to edit the CHANGELOG.md if needed
  await promptToEditChangelog(basePath, releaseVersion);

  console.log(`\n✅ Ready to release version ${chalk.yellow(releaseVersion)}!\n`);
  console.log('Commit the changes and the GitHub actions will handle creating a tag/release on GitHub.'); // eslint-disable-line max-len

  process.exit(0);
})();
