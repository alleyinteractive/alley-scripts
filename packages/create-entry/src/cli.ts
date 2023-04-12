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
export function getArgFromCLI(arg: string): string | null {
  const argIndex = process.argv.findIndex((cliArg) => cliArg.startsWith(`${arg}=`));
  if (argIndex !== -1) {
    const argValue = process.argv[argIndex].split('=')[1];
    return argValue || null;
  }
  return null;
}

/**
 * Check if an argument is present in the CLI.
 *
 * @param arg The argument to check for. Must include the leading '--'.
 * @returns Boolean - Whether the argument is present in the CLI.
 */
const hasArgInCLI = (arg: string): boolean => getArgFromCLI(arg) !== null;

export {
  getArgsFromCLI,
  hasArgInCLI,
};
