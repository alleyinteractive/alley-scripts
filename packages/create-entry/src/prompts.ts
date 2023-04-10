import prompts from 'prompts';
import formatSlug from './formatSlug';
import validateSlug from './validateSlug';

/**
 * Prompts the user to select an entry point type and returns the selected options.
 *
 * @returns - An object containing the selected options.
 */
async function promptForEntryPoint(): Promise<{
  entryType: string,
  slug: string,
  hasStyles: boolean,
  hasEnqueue: boolean
}> {
  const {
    entryType,
    slug,
    hasStyles,
    hasEnqueue,
  } = await prompts([
    {
      type: 'select',
      name: 'entryType',
      message: 'Create an basic entry point or a slotfill?',
      choices: [
        { title: 'Entry point', value: 'entry' },
        { title: 'Slotfill', value: 'slotfill' },
      ],
      initial: 0,
    },
    {
      type: 'text',
      name: 'slug',
      message: 'The entry point slug used for identification (also the output folder name):',
      validate: validateSlug,
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
    entryType,
    slug,
    hasStyles,
    hasEnqueue,
  };
}

/**
 * Prompts the user for a namespace or prefix to use and returns the selected option.
 *
 * @param hasEnqueue - Whether to prompt the user for a namespace.
 * @returns          - The selected namespace or an empty string.
 */
async function promptForNamespace(hasEnqueue: boolean): Promise<string> {
  if (!hasEnqueue) {
    return '';
  }

  const { nameSpace } = await prompts({
    type: 'text',
    name: 'nameSpace',
    message: 'The internal namespace or prefix for the entry:',
    validate: validateSlug,
    format: formatSlug,
    initial: 'create-wordpress-plugin',
  });

  return nameSpace;
}

export {
  promptForEntryPoint,
  promptForNamespace,
};
