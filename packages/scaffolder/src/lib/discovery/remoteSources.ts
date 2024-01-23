/* eslint-disable no-console */
import chalk from 'chalk';
import * as fs from 'fs';
import simpleGit from 'simple-git';

import {
  DirectorySource,
  GitSource,
  GithubSource,
  Source,
} from '../../types';
import { getGlobalConfigurationDir } from '../configuration';

/**
 * Handle remote sources that are checked out from a git repository.
 */
export function getCheckoutBaseDirectory() {
  return `${getGlobalConfigurationDir()}/.remote-sources`;
}

/**
 * Retrieve the git instance
 *
 * @todo All the configuration to specify git options.
 */
const createGit = (directory: string) => simpleGit({
  baseDir: directory,
  binary: process.env.GIT_BINARY || 'git',
  progress({ method, stage, progress }) {
    console.log(`git.${method} ${stage} stage ${progress}% complete`);
  },
});

// Escape all non alphanumeric characters in a string and replace it with a dash.
const escapeNonAlphanumeric = (str: string) => str.replace(/[^a-zA-Z0-9]/g, '-');

/**
 * Retrieve the local directory for a remote source.
 */
export function remoteSourceToLocalDirectory(source: Source): string {
  if ('github' in source) {
    // Retrieve the organization and repository name. Support either a full URL
    // being passed or just the organization and repository.
    const { github: url } = source;

    const [, org, repo] = url.match(/^(?:https:\/\/github.com\/)?([A-Za-z0-9_.-]*)\/([A-Za-z0-9_.-]*)(?:\.git)?(?:#[A-Za-z0-9_.-]*)?$/) || [];

    if (!org || !repo) {
      throw new Error(`Invalid GitHub URL: ${url}`);
    }

    return `${getCheckoutBaseDirectory()}/github/${escapeNonAlphanumeric(org)}/${escapeNonAlphanumeric(repo.replace(/\.git$/, ''))}`;
  }

  if ('git' in source) {
    const { git: url } = source;

    const [, protocol, host, org, repo] = url.match(/^(git@|https:\/\/)([A-Za-z0-9_.-]*)[/|:]([A-Za-z0-9_.-]*)\/([A-Za-z0-9_.-]*)(?:\.git)?(?:#[A-Za-z0-9_.-]*)?$/) || [];

    if (!protocol || !host || !org || !repo) {
      throw new Error(`Invalid Git URL: ${url}`);
    }

    return `${getCheckoutBaseDirectory()}/git/${escapeNonAlphanumeric(host)}/${escapeNonAlphanumeric(org)}/${escapeNonAlphanumeric(repo)}`;
  }

  throw new Error(`Unsupported source type: ${JSON.stringify(source)}`);
}

/**
 * Ensure a local repository is up to date.
 *
 * Only update the local repository once every hour.
 * TODO: Allow this cache to be overridden.
 */
async function updateLocalRepository(directory: string, source: GitSource) {
  const { git: cloneUrl } = source;

  // Extract the branch/commit from the clone URL.
  const [cleanUrl, revision] = cloneUrl.split('#', 2);

  // Check if the repository should be updated.
  if (fs.statSync(directory).mtimeMs > Date.now() - 3600000) {
    console.log(`Skipping ${chalk.green(cleanUrl)} [${chalk.yellow(revision || 'default branch')}]`);

    return true;
  }

  console.log(`Updating ${chalk.green(cleanUrl)} [${chalk.yellow(revision || 'default branch')}]`);

  const git = createGit(directory);

  await git.fetch();

  if (revision) {
    await git.checkout(revision);
  }

  return true;
}

/**
 * Clone a fresh copy of a repository.
 */
async function cloneFreshRepository(directory: string, source: GitSource) {
  const { git: cloneUrl } = source;

  // Extract the branch/commit from the clone URL.
  const [cleanUrl, revision] = cloneUrl.split('#', 2);

  console.log(`Cloning ${chalk.green(cleanUrl)} [${chalk.yellow(revision || 'default branch')}]`);

  const git = createGit(directory);

  await git.clone(cleanUrl);

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
export async function processGitSource(source: GitSource): Promise<DirectorySource> {
  const checkoutDirectory = remoteSourceToLocalDirectory(source);

  // Check if the directory exists. If it does, update the repository.
  if (fs.existsSync(checkoutDirectory)) {
    await updateLocalRepository(checkoutDirectory, source);
  } else {
    await cloneFreshRepository(checkoutDirectory, source);
  }

  return {
    directory: checkoutDirectory,
  };
}

/**
 * Process a GitHub source.
 *
 * @see processGitSource()
 */
export async function processGitHubSource(source: GithubSource): Promise<DirectorySource> {
  // Convert a GitHub source into a Git source. The source can be a full URL or
  // just the organization and repository name.
  const { github: url } = source;

  return {
    directory: url,
  };
}
