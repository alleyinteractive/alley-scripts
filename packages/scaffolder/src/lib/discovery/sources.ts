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

/**
 * Retrieve all the configured source directories to read from.
 */
export async function getSourceDirectories(rootDirectory: string): Promise<string[]> {
  const sourceDirectories = [];

  if (fs.existsSync(`${rootDirectory}/.scaffolder`)) {
    sourceDirectories.push(`${rootDirectory}/.scaffolder`);
  }

  const {
    sources: configuredSources = [],
  } = await getProjectConfiguration(rootDirectory);

  const combinedSources = [
    ...sourceDirectories,
    ...configuredSources,
    // Remove duplicate source directories.
  ].filter((value, index, self) => self.indexOf(value) === index);

  // Resolve any object-based sources.
  return Promise.all(
    combinedSources.map(async (source) => {
      if (typeof source === 'string') {
        return source;
      }

      if (typeof source !== 'object') {
        throw new Error(`Unsupported source type: ${typeof source}`);
      }

      if ('directory' in source) {
        return source.directory;
      }

      // if ('github' in source) {

      // }

      throw new Error(`Unsupported source type: ${typeof source}`);
    }),
  );
}
