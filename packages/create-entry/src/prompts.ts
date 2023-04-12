import prompts from 'prompts';
import { formatSlug } from './formatting.js';
import { validateSlug } from './validation.js';

/**
 * Prompts the user to select an entry point type and returns the selected options.
 *
 * @returns - An object containing the selected options.
 */
async function promptForEntryPoint(): Promise<{
  slug: string,
  hasStyles: boolean,
  hasEnqueue: boolean
}> {
  const {
    slug,
    hasStyles,
    hasEnqueue,
  } = await prompts([
    {
      type: 'text',
      name: 'slug',
      message: 'The entry point slug used for identification (also the output folder name):',
      validate: (value) => validateSlug(value)
        || 'Please enter a valid slug (lowercase, no spaces, only hyphens)',
      format: formatSlug,
    },
    {
      type: 'confirm',
      name: 'hasStyles',
      message: 'Include a stylesheet for this entry? (default false)',
      initial: false,
    },
    {
      type: 'confirm',
      name: 'hasEnqueue',
      message: 'Include a PHP file for enqueueing the entry? (default true)',
      initial: true,
    },
  ]);

  return {
    slug,
    hasStyles,
    hasEnqueue,
  };
}

/**
 * Prompts the user for a namespace or prefix to use and returns the selected option.
 *
 * @param initial    - The initial value for the namespace.
 * @returns          - The selected namespace or an empty string.
 */
async function promptForNamespace(initial: string = 'create-entry'): Promise<string> {
  const { nameSpace } = await prompts([
    {
      type: 'text',
      name: 'nameSpace',
      message: 'The internal namespace or prefix for the entry:',
      validate: (value) => validateSlug(value)
        || 'Please enter a valid namespace (lowercase, no spaces, only hyphens)',
      format: formatSlug,
      initial,
    },

  ]);

  return nameSpace;
}

export {
  promptForEntryPoint,
  promptForNamespace,
};
