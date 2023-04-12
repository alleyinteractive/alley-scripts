import { hasArgInCLI, getArgFromCLI } from './cli.js';
import { validateSlug } from './validation.js';
import { formatSlug } from './formatting.js';
import { promptForNamespace } from './prompts.js';

/**
 * Get the text domain from the CLI arguments. (default empty string)
 *
 * @returns string
 */
export function getTextDomain(): string {
  let textDomain = '';

  if (hasArgInCLI('--textdomain') && getArgFromCLI('--textdomain') !== null) {
    textDomain = getArgFromCLI('--textdomain') || '';

    if (validateSlug(textDomain) !== true) {
      // eslint-disable-next-line no-console
      console.error('Invalid value for --textdomain. Please enter a valid string (lowercase, no spaces, only hyphens)');
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

  if (hasArgInCLI('--namespace') && getArgFromCLI('--namespace') !== null) {
    nameSpace = getArgFromCLI('--namespace') || nameSpace;
  } else {
    nameSpace = hasEnqueue ? await promptForNamespace(nameSpace) : nameSpace;
  }

  if (validateSlug(nameSpace) !== true) {
    // eslint-disable-next-line no-console
    console.error('Invalid namespace. Please enter a valid namespace (lowercase, no spaces, only hyphens)');
    process.exit(1);
  }

  return formatSlug(nameSpace);
}
