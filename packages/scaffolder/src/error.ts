/* eslint-disable import/prefer-default-export */

import chalk from 'chalk';

/**
 * Exit error display message. The process will exit with a message.
 * @param message - The error message to display on exit.
 */
export function exitError(message: string): never {
  console.error(chalk?.red(message)); // eslint-disable-line no-console
  process.exit();
}
