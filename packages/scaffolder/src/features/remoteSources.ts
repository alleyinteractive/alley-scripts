/* eslint-disable max-len, no-console */

import fs from 'node:fs';
import chalk from 'chalk';

import {
  DirectorySource,
  GitSource,
  GithubSource,
  Source,
} from '../types';
import { getGlobalDirectory } from '../configuration';
import { logger } from '../logger';
import { createGit } from '../git';

/**
 * Handle remote sources that are checked out from a git repository.
 */
export function getCheckoutBaseDirectory() {
  return `${getGlobalDirectory()}/.remote-sources`;
}

// Escape all non alphanumeric characters in a string and replace it with a dash.
const escapeNonAlphanumeric = (str: string) => str.replace(/[^a-zA-Z0-9]/g, '-');

/**
 * Parse a GitHub URL into its components.
 *
 * Match the organization, repository, and revision from the URL.
 * Example: https://github.com/organization/repository.git#revision
 */
const parseGitHubUrl = (url: string) => {
  const [, org, repo, revision] = url.match(/^(?:(?:https:\/\/github.com\/)|(?:git@github.com:))?([A-Za-z0-9_.-]*)\/([A-Za-z0-9_.-]*)(?:\.git)?(#[A-Za-z0-9_.-/]*)?$/) || [];

  return {
    org,
    repo: repo ? repo.replace(/\.git$/, '') : undefined,
    revision: revision ? revision.slice(1) : undefined,
  };
};

/**
 * Retrieve the local directory for a remote source.
 */
export function remoteSourceToLocalDirectory(source: Source): string {
  if ('github' in source) {
    if (typeof source.github === 'string') {
      // Retrieve the organization and repository name. Support either a full URL
      // being passed or just the organization and repository.
      const { org, repo } = parseGitHubUrl(source.github);

      if (!org || !repo) {
        throw new Error(`Invalid GitHub URL: ${source.github}`);
      }

      return `${getCheckoutBaseDirectory()}/github/${escapeNonAlphanumeric(org)}/${escapeNonAlphanumeric(repo.replace(/\.git$/, ''))}`;
    }

    const {
      github = undefined,
      name = undefined,
      url = undefined,
    } = source.github;

    if (url) {
      const { org, repo } = parseGitHubUrl(url);

      if (!org || !repo) {
        throw new Error(`Invalid GitHub URL: ${url}`);
      }

      return `${getCheckoutBaseDirectory()}/github/${escapeNonAlphanumeric(org)}/${escapeNonAlphanumeric(repo)}`;
    } if (name) {
      const [org, repo] = name.split('/');

      return `${getCheckoutBaseDirectory()}/github/${escapeNonAlphanumeric(org)}/${escapeNonAlphanumeric(repo)}`;
    } if (github) {
      const [org, repo] = github.split('/');

      return `${getCheckoutBaseDirectory()}/github/${escapeNonAlphanumeric(org)}/${escapeNonAlphanumeric(repo)}`;
    }

    throw new Error(`Invalid GitHub source: ${JSON.stringify(source.github)}`);
  }

  if ('git' in source) {
    let url: string;

    if (typeof source.git === 'string') {
      url = source.git;
    } else {
      url = source.git.git || source.git.url || '';
    }

    if (!url) {
      throw new Error(`Invalid Git source: ${JSON.stringify(source.git)}`);
    }

    const [, protocol, host, org, repo] = url.match(/^(git@|https:\/\/)([A-Za-z0-9_.-]*)[/|:]([A-Za-z0-9_.-]*)\/([A-Za-z0-9_.-]*)(?:\.git)?(?:#[A-Za-z0-9_.-/]*)?$/) || [];

    if (!protocol || !host || !org || !repo) {
      throw new Error(`Invalid Git URL: ${url}`);
    }

    return `${getCheckoutBaseDirectory()}/git/${escapeNonAlphanumeric(host)}/${escapeNonAlphanumeric(org)}/${escapeNonAlphanumeric(repo)}`;
  }

  throw new Error(`Unsupported source type: ${JSON.stringify(source)}`);
}

/**
 * Ensure a local repository is up to date.
 * Only update the local repository once every hour.
 *
 * @todo Allow this cache to be overridden.
 */
async function updateLocalRepository(source: GitSource, directory: string) {
  const { git: cloneUrl } = source;

  let cleanUrl: string;
  let revision: string | undefined;
  let updateThreshold = 3600000; // 1 Hour.

  if (typeof cloneUrl === 'string') {
    // Extract the branch/commit from the clone URL.
    [cleanUrl, revision] = cloneUrl.split('#', 2);
  } else {
    cleanUrl = cloneUrl.url || cloneUrl.git || '';
    revision = cloneUrl.ref || undefined;
    updateThreshold = cloneUrl.updateThreshold
      ? parseInt(`${cloneUrl.updateThreshold}`, 10) || updateThreshold
      : updateThreshold;
  }

  const git = createGit(directory);

  // Clean the repository of any changes or untracked files.
  await git.clean('fd');

  // Check if the repository is tracking the proper revision
  if (revision) {
    const { current } = await git.status();

    if (current !== revision) {
      logger().debug(`Checking out ${chalk.green(cleanUrl)} [${chalk.yellow(revision || 'default branch')}]`);

      await git.checkout(revision);
    }
  }

  // Check if the repository should be updated and no revision was specified.
  if (fs.statSync(directory).mtimeMs > Date.now() - updateThreshold) {
    logger().debug(`Skipping updating ${chalk.green(cleanUrl)} [${chalk.yellow(revision || 'default branch')}]`);

    return true;
  }

  logger().debug(`Updating ${chalk.green(cleanUrl)} [${chalk.yellow(revision || 'default branch')}]`);

  await git.fetch();

  if (revision) {
    await git.checkout(revision);
  }

  return true;
}

/**
 * Clone a fresh copy of a repository.
 */
async function cloneFreshRepository(source: GitSource, directory: string) {
  const { git: gitSource } = source;

  let cleanUrl: string;
  let revision: string | undefined;

  if (typeof gitSource === 'string') {
    // Extract the branch/commit from the clone URL.
    [cleanUrl, revision] = gitSource.split('#', 2);
  } else {
    cleanUrl = gitSource.url || gitSource.git || '';
    revision = gitSource.ref || undefined;
  }

  logger().debug(`Cloning ${chalk.green(cleanUrl)} [${chalk.yellow(revision || 'default branch')}]`);

  // Ensure the directory exists.
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  const git = createGit(directory);

  await git.clone(cleanUrl, directory);

  if (revision) {
    await git.checkout(revision);
  }

  return true;
}

/**
 * A remote source is a git repository that is checked out to a local directory.
 * The git repository is updated every so often to ensure that the latest
 * version is available. The source is returned to the generator as a directory
 * source.
 */
export async function processGitSource(source: GitSource, directory?: string): Promise<DirectorySource> {
  const checkoutDirectory = directory || remoteSourceToLocalDirectory(source);
  let subDirectory: string | undefined;

  if (typeof source.git === 'object') {
    subDirectory = source.git.directory || undefined;
  }

  // Check if the directory exists. If it does, update the repository.
  if (fs.existsSync(checkoutDirectory)) {
    await updateLocalRepository(source, checkoutDirectory);
  } else {
    await cloneFreshRepository(source, checkoutDirectory);
  }

  // Check if the subdirectory exists and throw an error if it doesn't to
  // prevent the source from being used.
  if (subDirectory && !fs.existsSync(`${checkoutDirectory}/${subDirectory}`)) {
    throw new Error(`The subdirectory ${subDirectory} does not exist in the cloned repository`);
  }

  return {
    directory: `${checkoutDirectory}${subDirectory ? `/${subDirectory}` : ''}`,
  };
}

/**
 * Process a GitHub source.
 *
 * @see processGitSource()
 */
export async function processGitHubSource(source: GithubSource): Promise<DirectorySource> {
  const { github: githubSource } = source;

  if (typeof githubSource === 'string') {
    const { org, repo, revision } = parseGitHubUrl(githubSource);

    return processGitSource({
      git: {
        url: `https://github.com/${org}/${repo}.git`,
        ref: revision,
      },
    }, remoteSourceToLocalDirectory(source));
  }

  const {
    github = undefined,
    name = undefined,
    url = undefined,
  } = githubSource;

  if (!github && !name && !url) {
    throw new Error('GitHub source requires either a name or a URL to be specified');
  }

  return processGitSource({
    git: {
      url: github || url || `https://github.com/${name}.git`,
      ...githubSource,
    },
  }, remoteSourceToLocalDirectory(source));
}
