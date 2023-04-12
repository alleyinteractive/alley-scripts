import { validateSlug } from './validation.js';
import { formatSlug } from './formatting.js';
/**
 * Get the arguments passed to the CLI.
 *
 * @returns - An array of arguments passed to the CLI.
 */
const getArgsFromCLI = (): string[] => process.argv.slice(2);

/**
 * Get an individual argument from the CLI.
 *
 * @param arg The argument to get the value for. Must include the leading '--'.
 * @returns The value of the argument or null if the argument is not present.
 */
const getArgFromCLI = (arg: string): string | null => {
  // eslint-disable-next-line no-restricted-syntax
  for (const cliArg of process.argv.slice(2)) {
    const [name, value] = cliArg.split('=');
    if (name === arg) {
      return value || null;
    }
  }
  return null;
};

/**
 * Check if an argument is present in the CLI.
 *
 * @param arg The argument to check for. Must include the leading '--'.
 * @returns Boolean - Whether the argument is present in the CLI.
 */
const hasArgInCLI = (arg: string): boolean => getArgFromCLI(arg) !== null;

/**
 * Get an initial valid argument from the CLI arguments. Allow for setting a default value.
 *
 * @param initial The default value to use if the argument is not present in the CLI.
 * @param arg     The argument to get the value for. Must include the leading '--'.
 * @returns       A valid string
 */
function getInitialOptionForArg(initial: string, arg: string): string {
  let initialOption = initial;

  if (hasArgInCLI(arg) && getArgFromCLI(arg) !== null) {
    initialOption = getArgFromCLI(arg) || initialOption;
  }

  if (validateSlug(initialOption) !== true) {
    // eslint-disable-next-line no-console
    console.error(`Invalid value for ${arg}. Please enter a valid string (lowercase, no spaces, only hyphens)`);
    process.exit(1);
  }

  return formatSlug(initialOption);
}

export {
  getArgsFromCLI,
  getArgFromCLI,
  hasArgInCLI,
  getInitialOptionForArg,
};
