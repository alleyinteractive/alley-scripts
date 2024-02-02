import { createLogger, format, transports } from 'winston';

let instance: ReturnType<typeof createLogger>;

/**
 * Initialize the logger.
 *
 * The logger should print to the console in pretty print.
 */
export const initializeLogger = (debug: boolean = false) => {
  instance = createLogger({
    exitOnError: false,
    level: debug ? 'debug' : 'info',
    transports: [
      new transports.Console(),
    ],
    format: format.printf(({ message }) => message),
  });

  instance.debug('Logger initialized.');

  return instance;
};

/**
 * Get the logger instance.
 */
export const logger = () => {
  if (!instance) {
    throw new Error('Logger not initialized.');
  }

  return instance;
};
