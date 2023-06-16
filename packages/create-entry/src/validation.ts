import fs from 'fs';
import chalk from 'chalk';
import { type EntryArgs } from './entryArgs.js';

/**
 * Exit error display message. The process will exit with a message.
 * @param message - The error message to display on exit.
 */
export function exitError(message: string): void {
  console.error(
    chalk?.red(message),
  );
  process.exit();
}

/**
 * Validate a slug to ensure it is all lowercase and contains no spaces, only hyphens.
 *
 * @param slug - A string to validate.
 */
export function validateSlug(slug: string): boolean {
  // Regex to check if string is all lowercase and contains no spaces, only hyphens.
  const regex = /^[a-z]+(-[a-z]+)*$/;
  // Check if string matches the regex.
  return regex.test(slug);
}

/**
 * Display the format error message for a slug
 * that should be a valid string (lowercase, no spaces, only hyphens).
 *
 * @param displayVar - The variable to show in bold which should conform to the slug format.
 */
export function slugFormatError(displayVar: string) {
  const displayFlag = chalk?.yellow(displayVar);
  exitError(
    `Invalid format for ${displayFlag}.\n\nPlease enter a valid string (lowercase, no spaces, only hyphens).`,
  );
}

/**
 * Validate a function name to ensure it is all lowercase and contains only underscores.
 * @param functionName - A string to validate.
 */
export function validateFunctionName(functionName: string): boolean {
  // Check if string is all lowercase and contains only underscores
  const regex = /^[a-z_]+$/;
  return regex.test(functionName);
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

/**
 * Validate specific CLI args to be lowercase, no-spaces, only hyphens.
 * This function will exit the process if any value is not valid.
 *
 * @param args - The args to validate.
 * @param entries - The entries to validate against.
 */
export function validateCLIargs(args: string[], entries: EntryArgs) {
  if (args.length !== 0) {
    args.forEach((key: string) => {
      if (key && key in entries) {
        // @ts-ignore - key signatures with optional values.
        if (validateSlug(entries[key]) !== true) {
          slugFormatError(`--${key}`);
        }
      }
    });
  }
}
