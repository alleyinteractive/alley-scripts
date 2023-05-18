import { validateSlug } from './validation.js';
import { formatSlug } from './formatting.js';
import { promptForNamespace } from './prompts.js';
import createEntryArgs from './createEntryArgs.js';

export type EntryType = 'slotfill' | 'entry';

/**
 * Get the text domain from the CLI arguments. (default empty string)
 *
 * @returns string
 */
export function getTextDomain(): string {
  let textDomain = '';

  const {
    textdomain: textDomainFromArgs,
  } = createEntryArgs;

  if (textDomainFromArgs) {
    textDomain = textDomainFromArgs || '';

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

  const {
    namespace: nameSpaceFromArgs,
  } = createEntryArgs;

  if (nameSpaceFromArgs) {
    nameSpace = nameSpaceFromArgs || nameSpace;
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

/**
 * Get the entry type for the create entry script.
 *
 * @returns The entry type (default: 'entry').
 */
export function getEntryType(): EntryType {
  const {
    slotfill,
  } = createEntryArgs;

  return slotfill ? 'slotfill' : 'entry';
}
