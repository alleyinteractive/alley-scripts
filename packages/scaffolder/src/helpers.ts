import path from 'node:path';

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
    throw new Error(`Unsupported source type: ${JSON.stringify(source)}`);
  }

  if ('directory' in source) {
    return {
      directory: resolvePath(base, source.directory),
    };
  }

  if ('github' in source) {
    return source;
  }

  throw new Error(`Unsupported source to resolve: ${JSON.stringify(source)}`);
};

/**
 * Run a command with arguments and return the output.
 */
export const execaOutput = async (cmg: string, args: string[], options: object) => {
  const { execa } = await import('execa');

  try {
    const result = await execa(cmg, args, options);

    if (!result.failed) {
      return result.stdout;
    }
  } catch {
    // Ignore errors.
  }

  return undefined;
};

/**
 * Two-step argument splitting function that first splits arguments in quotes,
 * and then splits up the remaining arguments if they are not part of a quote.
 */
export function splitArgsFromString(argsString: string | string[]): string[] {
  if (Array.isArray(argsString)) {
    return argsString;
  }

  if (!argsString) {
    return [];
  }

  return argsString
    .split(/("[^"]*")/)
    .filter(Boolean)
    .map((arg) => {
      if (arg.includes('"')) {
        return arg.replaceAll('"', '');
      }

      return arg.trim().split(' ');
    })
    .flat();
}
