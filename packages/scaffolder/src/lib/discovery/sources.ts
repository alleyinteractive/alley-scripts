import fs from 'fs';

/**
 * Functionality to aid in the discovery of templates that can be used to
 * generate code.
 *
 * Out of the box we'll look for templates in the current folder and all the
 * parent directories. The end goal is to add the ability to look for templates
 * in a shared remote resource like a git repository.
 */

import { getProjectConfiguration } from '../configuration';
import { DirectorySource, Source } from '../../types';
import { processGitHubSource, processGitSource } from './remoteSources';

/**
 * Process the source for use within the generator.
 *
 * For remote sources such as GitHub/Git, the source is cloned to a local
 * directory and then returned as a directory source.
 */
async function processSource(source: Source): Promise<DirectorySource> {
  if (typeof source === 'object') {
    // Return the source if it's a directory source.
    if ('directory' in source) {
      return source;
    }

    // Convert the GitHub/Git source into a directory source.
    if ('github' in source) {
      return processGitHubSource(source);
    }

    if ('git' in source) {
      return processGitSource(source);
    }
  }

  throw new Error(`Unsupported source type: ${JSON.stringify(source)}`);
}

/**
 * Read all the available configuration files and determine all the available
 * sources.
 */
export async function getConfiguredSources(rootDirectory: string): Promise<DirectorySource[]> {
  const sources = [];

  // Include the project's scaffolder directory if it exists.
  if (fs.existsSync(`${rootDirectory}/.scaffolder`)) {
    sources.push({
      directory: `${rootDirectory}/.scaffolder`,
      root: rootDirectory,
    });
  }

  const {
    root: {
      config: rootConfiguration = {},
    },
    project: {
      location: projectDirectory,
      config: projectConfiguration = {},
    },
  } = await getProjectConfiguration(rootDirectory);

  const {
    sources: rootSources = [],
  } = rootConfiguration || {};

  const {
    sources: projectSources = [],
  } = projectConfiguration || {};

  // Return early if there are no sources configured.
  if (!rootSources.length && !projectSources.length) {
    return Promise.all(sources.map(processSource));
  }

  /**
   * Pre-process the source.
   *
   * Ensures that directory sources have the 'root' directory set that allows
   * them to be resolved when using relative paths.
   */
  const preProcessSourceForRoot = (source: Source | string, root: string): Source => {
    if (typeof source === 'string') {
      return { root, directory: source } as DirectorySource;
    }

    if ('directory' in source) {
      return { root, ...source } as DirectorySource;
    }

    return source;
  };

  // Reduce the root and project sources into a single stream of sources.
  sources.push(
    ...rootSources.map((source) => preProcessSourceForRoot(source, rootDirectory)),
    ...projectSources.map((source) => preProcessSourceForRoot(source, projectDirectory)),
  );

  return Promise.all(sources.map(processSource));
}
