import fs from 'fs';

/**
 * Check for a directory's existence.
 *
 * @param directory - The directory to check for its existence.
 */
export default async function directoryExists(directory: string): Promise<boolean> {
  try {
    await fs.promises.stat(directory);
    return true;
  } catch (error) {
    return false;
  }
}
