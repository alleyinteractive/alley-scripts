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
export const resolveSourcePath = (base: string, source: Source): string | Source => {
  if (typeof source === 'string') {
    return resolvePath(base, source);
  }

  if (typeof source !== 'object') {
    throw new Error(`Unsupported source type: ${typeof source}`);
  }

  if ('directory' in source) {
    return resolvePath(base, source.directory);
  }

  return source;
};
