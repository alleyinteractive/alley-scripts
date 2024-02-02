import { processGitHubSource, processGitSource } from './remoteSources';
import type { DirectorySource, Source } from '../types/source';

/**
 * Process the source for use within the generator.
 *
 * For remote sources such as GitHub/Git, the source is cloned to a local
 * directory and then returned as a directory source.
 */
export async function resolveSourceToDirectory(source: Source): Promise<DirectorySource> {
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
