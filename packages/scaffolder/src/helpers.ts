import path from 'path';

/**
 * Resolve the absolute path of a file relative to a base directory.
 */
export const resolvePath = (base: string, filePath: string) => (path.isAbsolute(filePath)
  ? filePath
  : path.join(base, filePath));
