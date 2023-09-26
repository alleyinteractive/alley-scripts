import fs from 'fs';
import chalk from 'chalk';
import { valid } from 'semver';

import { ReleaseType } from './options';

/**
 * Exit error display message. The process will exit with a message.
 * @param message - The error message to display on exit.
 */
function exitError(message: string): void {
  console.error(chalk?.red(message)); // eslint-disable-line no-console
  process.exit();
}

/**
 * Escape a string for use in a regular expression.
 */
function pregQuote(str: string) {
  return str.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&').replace(/-/g, '\\x2d');
}

/**
 * Read the headers of a WordPress plugin file.
 */
function readPluginHeaders(path: string): Record<string, string> | null {
  const contents = fs.readFileSync(path, 'utf8');
  const parsedHeaders: Record<string, string> = {};

  const headers: Record<string, string> = {
    name: 'Plugin Name',
    uri: 'Plugin URI',
    description: 'Description',
    author: 'Author',
    author_uri: 'Author URI',
    version: 'Version',
    requires_php: 'Requires PHP',
    requires_at_least: 'Requires at least',
    tested_up_to: 'Tested up to',
    requires: 'Requires WordPress',
    license: 'License',
    license_uri: 'License URI',
  };

  Object.keys(headers).forEach((key) => {
    const regex = new RegExp(`^(?:[ \\t]*<\\?php)?[ \\t\\/*#@]*${pregQuote(headers[key])}:(.*)$`, 'mi');

    const matches = contents.match(regex);

    if (matches) {
      parsedHeaders[key] = matches[1].trim();
    }
  });

  return parsedHeaders.name ? parsedHeaders : null;
}

/**
 * Extract the current version of the plugin.
 *
 * Supports extracting the version from the composer.json file or the WordPress
 * plugin headers.
 */
function getCurrentVersion(path: string): string | undefined {
  // Retrieve the plugin file to read the headers from.
  const files = [
    `${path.split('/').pop()}.php`,
    'plugin.php',
  ];

  // Loop through the files and check if they exist.
  for (let i = 0; i < files.length; i += 1) {
    const file = `${path}/${files[i]}`;

    if (!fs.existsSync(file)) {
      continue; // eslint-disable-line no-continue
    }

    const headers = readPluginHeaders(file);

    if (headers?.version) {
      if (valid(headers.version)) {
        return headers.version;
      }

      exitError(
        `The version number in the plugin file is not a valid semver version number: ${headers.version}`, // eslint-disable-line max-len
      );
    }
  }

  // Check if the composer.json file exists.
  if (fs.existsSync(`${path}/composer.json`)) {
    try {
      const contents = JSON.parse(
        fs.readFileSync(`${path}/composer.json`, 'utf8'),
      );

      if (contents.version) {
        if (valid(contents.version)) {
          return contents.version;
        }

        exitError(
          `The version number in the composer.json file is not a valid semver version number: ${contents.version}`,
        );
      }
    } catch (error) {
      // Do nothing.
    }
  }

  return undefined;
}

/**
 * Retrieve the release type from the current version and the new version.
 */
function getReleaseType(currentVersion: string, newVersion: string): ReleaseType | undefined {
  const currentParts = currentVersion.split('.');
  const newParts = newVersion.split('.');

  if (newParts.length !== 3) {
    return undefined;
  }

  if (currentParts.length !== 3) {
    return 'major';
  }

  if (newParts[0] > currentParts[0]) {
    return 'major';
  }

  if (newParts[1] > currentParts[1]) {
    return 'minor';
  }

  if (newParts[2] > currentParts[2]) {
    return 'patch';
  }

  return undefined;
}

/**
 * Bump the version number given the type of release.
 */
function bumpVersion(version: string, releaseType: ReleaseType): string {
  const versionParts = version.split('.');
  const major = parseInt(versionParts[0], 10);
  const minor = parseInt(versionParts[1], 10);
  const patch = parseInt(versionParts[2], 10);

  switch (releaseType) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      return version;
  }
}

/**
 * Upgrade the version number in the composer.json file.
 */
function upgradeComposerVersion(basePath: string, version: string): void {
  try {
    const contents = JSON.parse(
      fs.readFileSync(`${basePath}/composer.json`, 'utf8'),
    );

    // Insert the version after the description/name index if it doesn't exist.
    if (!contents.version) {
      const insertIndex = Object.keys(contents).indexOf('description') || Object.keys(contents).indexOf('name');

      contents.version = version;

      const newContents: Record<string, any> = {};

      Object.keys(contents).forEach((key, index) => {
        if (index === insertIndex + 1) {
          newContents.version = version;
        }

        newContents[key] = contents[key];
      });

      fs.writeFileSync(
        `${basePath}/composer.json`,
        `${JSON.stringify(newContents, null, 4)}\n`,
      );
    } else {
      contents.version = version;

      fs.writeFileSync(
        `${basePath}/composer.json`,
        `${JSON.stringify(contents, null, 4)}\n`,
      );
    }
  } catch (error) {
    console.error(error); // eslint-disable-line no-console

    exitError(
      'There was an error upgrading the version number in the composer.json file.',
    );
  }
}

/**
 * Upgrade the version number in the package.json file.
 */
function upgradeNpmPackageVersion(basePath: string, version: string): void {
  try {
    const contents = JSON.parse(
      fs.readFileSync(`${basePath}/package.json`, 'utf8'),
    );

    // Insert the version after the description/name index if it doesn't exist.
    if (!contents.version) {
      const insertIndex = Object.keys(contents).indexOf('name');

      contents.version = version;

      const newContents: Record<string, any> = {};

      Object.keys(contents).forEach((key, index) => {
        if (index === insertIndex + 1) {
          newContents.version = version;
        }

        newContents[key] = contents[key];
      });

      fs.writeFileSync(
        `${basePath}/package.json`,
        `${JSON.stringify(newContents, null, 4)}\n`,
      );
    } else {
      contents.version = version;

      fs.writeFileSync(
        `${basePath}/package.json`,
        `${JSON.stringify(contents, null, 4)}\n`,
      );
    }
  } catch (error) {
    console.error(error); // eslint-disable-line no-console

    exitError(
      'There was an error upgrading the version number in the package.json file.',
    );
  }
}

/**
 * Upgrade the version number in the plugin header.
 */
function upgradePluginVersion(basePath: string, version: string): void {
  const files = [
    `${basePath.split('/').pop()}.php`,
    'plugin.php',
  ];

  // Loop through the files and check if they exist.
  for (let i = 0; i < files.length; i += 1) {
    const file = `${basePath}/${files[i]}`;

    if (!fs.existsSync(file)) {
      continue; // eslint-disable-line no-continue
    }

    const contents = fs.readFileSync(file, 'utf8');

    const newContents = contents.replace(
      /(\* Version: )(.*)/g,
      `$1${version}`,
    );

    if (contents !== newContents) {
      fs.writeFileSync(file, newContents);
      return;
    }
  }

  exitError('Unable to upgrade the "Version" plugin header.');
}

/**
 * Upgrade the version number in the README.md/README.txt file.
 */
function upgradeReadmeVersion(basePath: string, version: string): void {
  const files = [
    'README.md',
    'README.txt',
  ];

  // Loop through the files and check if they exist.
  for (let i = 0; i < files.length; i += 1) {
    const file = `${basePath}/${files[i]}`;

    if (!fs.existsSync(file)) {
      continue; // eslint-disable-line no-continue
    }

    // Replace "Stable tag: " in the README.md/README.txt with "Stable tag: {version}".
    const contents = fs.readFileSync(file, 'utf8');

    const newContents = contents.replace(
      /(Stable tag: )(.*)/g,
      `$1${version}`,
    );

    if (contents !== newContents) {
      fs.writeFileSync(file, newContents);
    }
  }
}

export {
  exitError,
  getCurrentVersion,
  getReleaseType,
  bumpVersion,
  upgradeComposerVersion,
  upgradeNpmPackageVersion,
  upgradePluginVersion,
  upgradeReadmeVersion,
};
