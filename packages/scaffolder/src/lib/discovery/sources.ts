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

/**
 * Process the source for use within the generator.
 */
async function processSource(source: Source | string): Promise<DirectorySource> {
  if (typeof source === 'string') {
    // Reformat a string source into a directory source.
    return {
      directory: source,
    } as DirectorySource;
  }

  if (typeof source === 'object') {
    // Return the source if it's a directory source.
    if ('directory' in source) {
      return source;
    }

    // Convert the GitHub source into a directory source.
    if ('github' in source) {
      // @todo Implement GitHub source.
    }
  }

  throw new Error(`Unsupported source type: ${typeof source}`);
}

/**
 * Retrieve all the configured source directories to read from.
 */
export async function getConfiguredSources(rootDirectory: string): Promise<DirectorySource[]> {
  const sourceDirectories = [];

  // Include the project's scaffolder directory if it exists.
  if (fs.existsSync(`${rootDirectory}/.scaffolder`)) {
    sourceDirectories.push(`${rootDirectory}/.scaffolder`);
  }

  const {
    sources: configuredSources = [],
  } = await getProjectConfiguration(rootDirectory);

  const combinedSources = [
    ...sourceDirectories,
    ...configuredSources,
    // Remove duplicate/invalid source directories.
  ].filter((value, index, self) => value && self.indexOf(value) === index);

  return Promise.all(combinedSources.map(processSource));
}
