/* eslint-disable import/prefer-default-export */

import chalk from 'chalk';

/**
 * Exit error display message.
 */
export default function handleError(message: string): never {
  console.error(chalk?.red(message)); // eslint-disable-line no-console
  process.exit(1);
}
