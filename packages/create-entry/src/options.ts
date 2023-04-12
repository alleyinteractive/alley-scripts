import { validateSlug } from './validation.js';
import { formatSlug } from './formatting.js';
import { promptForNamespace } from './prompts.js';
import { getArgFromCLI, hasArgInCLI } from './cli.js';

/**
 * Get an initial valid argument from the CLI arguments. Allow for setting a default value.
 *
 * @param initial The default value to use if the argument is not present in the CLI.
 * @param arg     The argument to get the value for. Must include the leading '--'.
 * @returns       A valid string
 */
export function getInitialOptionForArg(initial: string, arg: string): string {
  let initialOption = initial;

  if (hasArgInCLI(arg)) {
    initialOption = getArgFromCLI(arg) || initialOption;
  }

  if (validateSlug(initialOption) !== true) {
    // eslint-disable-next-line no-console
    console.error(
      `Invalid value for ${arg}. Please enter a valid string (lowercase, no spaces, only hyphens)`,
    );
    process.exit(1);
  }

  return formatSlug(initialOption);
}

/**
 * Get the text domain from the CLI arguments. (default empty string)
 *
 * @returns string
 */
export function getTextDomain(): string {
  let textDomain = '';

  if (hasArgInCLI('--textdomain')) {
    textDomain = getArgFromCLI('--textdomain') || '';

    if (validateSlug(textDomain) !== true) {
      // eslint-disable-next-line no-console
      console.error(
        'Invalid value for --textdomain. Please enter a valid string (lowercase, no spaces, only hyphens)',
      );
      process.exit(1);
    }
  }

  return textDomain;
}

/**
 * Get the namespace from the CLI arguments or prompt the user for one.
 *
 * @param hasEnqueue - Whether the entry point has an enqueue PHP file.
 * @returns A promise with the namespace (default: 'create-entry').
 */
export async function getNameSpace(hasEnqueue: boolean): Promise<string> {
  // The initial namespace.
  let nameSpace = 'create-entry';

  if (hasArgInCLI('--namespace')) {
    nameSpace = getArgFromCLI('--namespace') || nameSpace;
  } else {
    nameSpace = hasEnqueue ? await promptForNamespace(nameSpace) : nameSpace;
  }

  if (validateSlug(nameSpace) !== true) {
    // eslint-disable-next-line no-console
    console.error(
      'Invalid namespace. Please enter a valid namespace (lowercase, no spaces, only hyphens)',
    );
    process.exit(1);
  }

  return formatSlug(nameSpace);
}
