import simpleGit from 'simple-git';
import * as fs from 'fs';

import { DirectorySource, GitSource, GithubSource, Source } from '../../types';
import { getGlobalConfigurationDir } from '../configuration';

const git = simpleGit();

/**
 * Handle remote sources that are checked out from a git repository.
 */
export function getCheckoutBaseDirectory() {
  return `${getGlobalConfigurationDir()}/.remote-sources`;
}

// Escape all non alphanumeric characters in a string and replace it with a dash.
const escapeNonAlphanumeric = (str: string) => str.replace(/[^a-zA-Z0-9]/g, '-');

/**
 * Retrieve the local directory for a remote source.
 *
 * @todo Support Git sources.
 */
export function remoteSourceToLocalDirectory(source: Source): string {
  if ('github' in source) {
    // Retrieve the organization and repository name. Support either a full URL
    // being passed or just the organization and repository.
    const { github: url } = source;

    const [, org, repo] = url.match(/^(?:https:\/\/github.com\/)?([A-Za-z0-9_.-]*)\/([A-Za-z0-9_.-]*)(?:\.git)?$/) || [];

    if (!org || !repo) {
      throw new Error(`Invalid GitHub URL: ${url}`);
    }

    return `${getCheckoutBaseDirectory()}/github/${escapeNonAlphanumeric(org)}/${escapeNonAlphanumeric(repo.replace(/\.git$/, ''))}`;
  }

  if ('git' in source) {
    const { git: url } = source;

    const [, protocol, host, org, repo] = url.match(/^(git@|https:\/\/)([A-Za-z0-9_.-]*)[/|:]([A-Za-z0-9_.-]*)\/([A-Za-z0-9_.-]*)(?:\.git)?$/) || [];

    if (!protocol || !host || !org || !repo) {
      throw new Error(`Invalid Git URL: ${url}`);
    }

    return `${getCheckoutBaseDirectory()}/git/${escapeNonAlphanumeric(host)}/${escapeNonAlphanumeric(org)}/${escapeNonAlphanumeric(repo)}`;
  }

  throw new Error(`Unsupported source type: ${JSON.stringify(source)}`);
}

/**
 * Ensure a local repository is up to date.
 */
async function updateLocalRepository(source: Source, directory: string) {

}

/**
 * Clone a fresh copy of a repository.
 */
async function cloneFreshRepository(source: Source, directory: string) {

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
    await updateLocalRepository(source, checkoutDirectory);
  } else {
    await cloneFreshRepository(source, checkoutDirectory);
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
  return {
    directory: '',
  };
}
