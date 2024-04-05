import { processGitHubSource, processGitSource } from './remoteSources';
import type { DirectorySource, Source } from '../types/source';
import { logger } from '../logger';

/**
 * Process the source for use within the generator.
 *
 * For remote sources such as GitHub/Git, the source is cloned to a local
 * directory and then returned as a directory source.
 */
export async function resolveSourceToDirectory(source: Source): Promise<DirectorySource | null> {
  try {
    if (typeof source === 'object') {
      // Return the source if it's a directory source.
      if ('directory' in source) {
        return source;
      }

      // Convert the GitHub/Git source into a directory source.
      if ('github' in source) {
        return await processGitHubSource(source);
      }

      if ('git' in source) {
        return await processGitSource(source);
      }
    }

    throw new Error(`Unsupported source type: ${JSON.stringify(source)}`);
  } catch (error: any) {
    logger().error(`Failed to resolve source to directory: ${error.message}`);

    return null;
  }
}
