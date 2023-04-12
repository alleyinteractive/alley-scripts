import fs from 'fs';

/**
 * Validate a slug to ensure it is all lowercase and contains no spaces, only hyphens.
 * @param slug - A string to validate.
 */
export function validateSlug(slug: string): boolean {
  // Regex to check if string is all lowercase and contains no spaces, only hyphens.
  const regex = /^[a-z]+(-[a-z]+)*$/;
  // Check if string matches the regex.
  return regex.test(slug);
}

/**
 * Check for a directory's existence.
 *
 * @param directory - The directory to check for its existence.
 */
export async function directoryExists(directory: string): Promise<boolean> {
  try {
    await fs.promises.stat(directory);
    return true;
  } catch (error) {
    return false;
  }
}
