/* eslint-disable import/prefer-default-export */

import chalk from 'chalk';
import { logger } from './logger';

/**
 * Exit error display message.
 */
export default function handleError(message: string): never {
  logger().error(chalk?.red(message));
  process.exit(1);
}
