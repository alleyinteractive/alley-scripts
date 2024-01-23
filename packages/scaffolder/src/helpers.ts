import path from 'path';
import { Source } from './types';

/**
 * Resolve the absolute path of a file relative to a base directory.
 */
export const resolvePath = (base: string, filePath: string) => (path.isAbsolute(filePath)
  ? filePath
  : path.join(base, filePath));

/**
 * Resolve the absolute path of a source relative to a base directory.
 */
export const resolveSourcePath = (base: string, source: string | Source): Source => {
  if (typeof source === 'string') {
    return {
      directory: resolvePath(base, source),
    };
  }

  if (typeof source !== 'object') {
    throw new Error(`Unsupported source type: ${typeof source}`);
  }

  if ('directory' in source) {
    return {
      directory: resolvePath(base, source.directory),
    };
  }

  if ('github' in source) {
    return source;
  }

  throw new Error(`Unsupported source to resolve: ${typeof source}`);
};
