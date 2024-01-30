import prompts from 'prompts';

import handleError from './error';
import type { FeatureInput } from '../types';
import { logger } from './logger';

/**
 * Prompt the user for inputs to a feature by parsing the inputs and generating
 * questions for prompts.
 */
export default async function collectInputs(featureInputs: FeatureInput[]) {
  const inputs: Record<string, string | boolean> = {};

  if (!featureInputs.length) {
    logger().debug('No inputs to collect.');

    return inputs;
  }

  logger().debug(`Collecting ${featureInputs.length} input(s)`);

  const questions = featureInputs.map((input): prompts.PromptObject<string> => { // eslint-disable-line consistent-return, max-len, array-callback-return
    const {
      default: defaultValue = undefined,
      description = undefined,
      name: inputName,
      required = true,
      type = 'string',
    } = input;

    if (type === 'string') {
      return {
        type: 'text',
        name: inputName,
        message: description || `Enter a value for ${inputName}`,
        initial: defaultValue || undefined,
        validate: (value) => {
          if (!required && !value.length) {
            return true;
          }

          return value.length > 0 || `Please enter a value for ${inputName}`;
        },
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

  return prompts(questions, {
    onCancel: () => handleError('User cancelled.'),
  });
}
