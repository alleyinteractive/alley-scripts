import prompts from 'prompts';
import fs from 'fs';
import { formatSlug } from './formatting.js';
import {
  validateFunctionName,
  validateSlug,
} from './validation.js';
import {
  getEntryType,
  type EntryType,
} from './options.js';

/**
 * Prompts the user to enter a slug and returns the slug.
 *
 * @returns - A slug as a string.
 */
async function promptForSlug(): Promise<string> {
  const entryType: EntryType = getEntryType();

  const { slug } = await prompts([
    {
      type: 'text',
      name: 'slug',
      message: `The ${entryType} slug used for identification (also the output folder name):`,
      validate: (value) => {
        if (fs.existsSync(value)) {
          return 'A directory with this name already exists. Please choose another name.';
        }

        return validateSlug(value)
          || 'Please enter a valid slug (lowercase, no spaces, only hyphens)';
      },
      format: formatSlug,
    },
  ]);

  // If no slug is provided, exit the process to prevent the application flow from continuing.
  if (!slug) {
    console.log('A slug is required for scaffolding an entry point. Either the slug was empty or the slug directory already exists. Exiting...');
    process.exit(0);
  }

  return slug;
}

/**
 * Prompts the user to select an entry point type and returns the selected options.
 *
 * @returns - An object containing the selected options.
 */
async function promptForEntryPoint(): Promise<{
  hasStyles: boolean,
  hasEnqueue: boolean
}> {
  const entryType: EntryType = getEntryType();

  const {
    hasStyles,
    hasEnqueue,
  } = await prompts([
    {
      type: 'confirm',
      name: 'hasStyles',
      message: `Include a stylesheet for this ${entryType}? (default false)`,
      initial: false,
    },
    {
      type: 'confirm',
      name: 'hasEnqueue',
      message: `Include a PHP file for enqueueing the ${entryType}? (default true)`,
      initial: true,
    },
  ]);

  return {
    hasStyles,
    hasEnqueue,
  };
}

/**
 * Prompts the user for a namespace or prefix to use and returns the selected option.
 *
 * @param initial - The initial value for the namespace.
 * @returns       - The selected namespace or an empty string.
 */
async function promptForNamespace(initial: string = 'create-entry'): Promise<string> {
  const entryType: EntryType = getEntryType();
  const { nameSpace } = await prompts([
    {
      type: 'text',
      name: 'nameSpace',
      message: `The internal namespace or prefix for the ${entryType}:`,
      validate: (value) => validateSlug(value)
        || 'Please enter a valid namespace (lowercase, no spaces, only hyphens)',
      format: formatSlug,
      initial,
    },

  ]);

  return nameSpace;
}

/**
 * Prompts for setting an action hook to use for enqueueing the entry.
 *
 * @returns - The selected action hook.
 */
async function promptForEnqueueHook(): Promise<string> {
  const { enqueueHook } = await prompts([
    {
      type: 'text',
      name: 'enqueueHook',
      message: 'The hook to use for enqueueing the entry:',
      validate: (value) => validateFunctionName(value)
        || 'Please enter a valid function name (lowercase, no spaces, only underscores)',
      initial: 'wp_enqueue_scripts',
    },
  ]);

  return enqueueHook;
}

/**
 * Prompts for setting an action hook to use for enqueueing the style.
 *
 * @returns - The selected action hook.
 */
async function promptForEnqueueStyleHook(): Promise<string> {
  const { enqueueStyleHook } = await prompts([
    {
      type: 'text',
      name: 'enqueueStyleHook',
      message: 'The hook to use for enqueueing the entry styles:',
      validate: (value) => validateFunctionName(value)
        || 'Please enter a valid function name (lowercase, no spaces, only underscores)',
      initial: 'wp_enqueue_styles',
    },
  ]);

  return enqueueStyleHook;
}

export {
  promptForSlug,
  promptForEntryPoint,
  promptForNamespace,
  promptForEnqueueHook,
  promptForEnqueueStyleHook,
};
