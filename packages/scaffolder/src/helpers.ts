import prompts from 'prompts';
import { FeatureInput } from './types.js';
import handleError from './error.js';

/**
 * Escape a string for use in a regular expression.
 */
export function pregQuote(str: string) {
  return str.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&').replace(/-/g, '\\x2d');
}

/**
 * Prompt the user for inputs to a feature by parsing the inputs and generating
 * questions for prompts.
 */
export async function collectInputs(featureInputs: FeatureInput[]) {
  const inputs: Record<string, any> = {};

  if (!featureInputs.length) {
    return inputs;
  }

  const questions = featureInputs.map((input): prompts.PromptObject<string> => { // eslint-disable-line consistent-return, max-len, array-callback-return
    const {
      name: inputName,
      description = undefined,
      type = 'string',
      default: defaultValue = undefined,
    } = input;

    if (type === 'string') {
      return {
        type: 'text',
        name: inputName,
        message: description || `Enter a value for ${inputName}`,
        initial: defaultValue || undefined,
        validate: (value) => value.length > 0 || `Please enter a value for ${inputName}`,
      };
    }

    if (type === 'boolean') {
      return {
        type: 'toggle',
        name: inputName,
        message: description || `Enter a value for ${inputName}`,
        initial: typeof defaultValue === 'boolean' ? defaultValue : false,
        active: 'yes',
        inactive: 'no',
      };
    }

    handleError(`🚨 Unsupported input type ${type} for ${inputName}`);
  });

  return prompts(questions);
}
