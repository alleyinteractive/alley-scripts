/**
 * Get the arguments passed to the CLI.
 *
 * @returns - An array of arguments passed to the CLI.
 */
const getArgsFromCLI = () => process.argv.slice(2);

const getArgFromCLI = (arg: string) => {
  for (const cliArg of process.argv.slice(2)) {
    const [name, value] = cliArg.split('=');
    if (name === arg) {
      return value || null;
    }
  }
  return null;
};

const hasArgInCLI = (arg: string) => getArgFromCLI(arg) !== undefined;

export {
  getArgsFromCLI,
  getArgFromCLI,
  hasArgInCLI,
};
