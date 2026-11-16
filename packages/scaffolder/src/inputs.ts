import prompts from 'prompts';

import handleError from './error';
import { logger } from './logger';
import type { FeatureInput } from './types';

export type InputValue = string | boolean;

export type InputValues = Record<string, InputValue>;

/**
 * Normalized description of a feature input, shared by YAML and JavaScript features.
 */
export type InputDefinition = {
  name: string;
  type: 'string' | 'boolean';
  required: boolean;
  default?: InputValue;
  description?: string;
  question: prompts.PromptObject<string>;
};

export type CollectInputsOptions = {
  /* Inputs supplied on the command line. */
  provided?: InputValues;
  /* Whether the user can be prompted for missing inputs. */
  interactive?: boolean;
  /* Feature name used in error messages. */
  featureName?: string;
};

const truthyValues = ['true', '1', 'yes', 'y', 'on'];
const falsyValues = ['false', '0', 'no', 'n', 'off'];

/**
 * Parse the --input and --inputs command line arguments into input values.
 */
export function parseInputArguments(input: string[] = [], inputsJson?: string): InputValues {
  const values: InputValues = {};

  if (inputsJson) {
    let parsed: unknown;

    try {
      parsed = JSON.parse(inputsJson);
    } catch (error: any) {
      throw new Error(`--inputs must be a JSON object: ${error.message}`);
    }

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('--inputs must be a JSON object, for example --inputs \'{"name":"value"}\'.');
    }

    Object.entries(parsed).forEach(([key, value]) => {
      values[key] = typeof value === 'boolean' ? value : String(value);
    });
  }

  input.forEach((pair) => {
    const index = pair.indexOf('=');

    if (index < 1) {
      throw new Error(`Invalid --input "${pair}". Use --input key=value.`);
    }

    values[pair.slice(0, index)] = pair.slice(index + 1);
  });

  return values;
}

/**
 * Coerce a provided value to a boolean.
 */
function toBoolean(name: string, value: InputValue): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  const normalized = value.trim().toLowerCase();

  if (truthyValues.includes(normalized)) {
    return true;
  }

  if (falsyValues.includes(normalized)) {
    return false;
  }

  throw new Error(`Input "${name}" must be a boolean (true or false), received "${value}".`);
}

/**
 * Convert YAML feature inputs to input definitions.
 */
export function definitionsFromFeatureInputs(featureInputs: FeatureInput[]): InputDefinition[] {
  return featureInputs.map((input) => {
    const {
      default: defaultValue = undefined,
      description = undefined,
      name: inputName,
      required = true,
      type = 'string',
    } = input;

    if (type === 'string') {
      return {
        name: inputName,
        type,
        required,
        default: defaultValue || undefined,
        description,
        question: {
          type: 'text',
          name: inputName,
          message: description || `Enter a value for ${inputName}`,
          initial: defaultValue || undefined,
          validate: (value: string) => {
            if (!required && !value.length) {
              return true;
            }

            return value.length > 0 || `Please enter a value for ${inputName}`;
          },
        },
      };
    }

    if (type === 'boolean') {
      const initial = typeof defaultValue === 'boolean' ? defaultValue : false;

      return {
        name: inputName,
        type,
        required,
        default: initial,
        description,
        question: {
          type: 'toggle',
          name: inputName,
          message: description || `Enter a value for ${inputName}`,
          initial,
          active: 'yes',
          inactive: 'no',
        },
      };
    }

    return handleError(`🚨 Unsupported input type ${type} for ${inputName}`);
  });
}

/**
 * Convert the prompt objects returned by a JavaScript feature to input definitions.
 */
export function definitionsFromPrompts(questions: prompts.PromptObject[]): InputDefinition[] {
  return questions
    .filter((question) => typeof question.name === 'string')
    .map((question) => {
      const name = question.name as string;
      const isBoolean = ['confirm', 'toggle'].includes(String(question.type));
      const message = typeof question.message === 'string' ? question.message : undefined;
      let defaultValue: InputValue | undefined;

      if (isBoolean) {
        defaultValue = typeof question.initial === 'boolean' ? question.initial : false;
      } else if (typeof question.initial === 'number' && Array.isArray(question.choices)) {
        const choice = question.choices[question.initial];
        defaultValue = choice ? String(choice.value ?? choice.title) : undefined;
      } else if (['string', 'number'].includes(typeof question.initial)) {
        defaultValue = String(question.initial);
      }

      return {
        name,
        type: isBoolean ? 'boolean' : 'string',
        required: defaultValue === undefined,
        default: defaultValue,
        description: message,
        question: question as prompts.PromptObject<string>,
      };
    });
}

/**
 * Build the error shown when required inputs are missing in non-interactive mode.
 */
function missingInputsMessage(
  missing: InputDefinition[],
  definitions: InputDefinition[],
  featureName = '<feature>',
): string {
  const example = definitions
    .filter((definition) => definition.required && definition.default === undefined)
    .map((definition) => `--input ${definition.name}=<${definition.name}>`)
    .join(' ');

  return [
    `Missing required input(s) for "${featureName}":`,
    ...missing.map((definition) => `  - ${definition.name} (${definition.type})${definition.description ? `: ${definition.description}` : ''}`),
    '',
    'Pass them on the command line, for example:',
    `  scaffolder ${featureName} --non-interactive ${example}`,
    '',
    `Run "scaffolder ${featureName} --describe" to see every input.`,
  ].join('\n');
}

/**
 * Resolve input values from provided values, defaults, and prompts.
 *
 * Interactive runs prompt for every input that was not provided. Non-interactive
 * runs fall back to defaults and throw if a required input is missing.
 */
export async function resolveInputs(
  definitions: InputDefinition[],
  options: CollectInputsOptions = {},
): Promise<InputValues> {
  const { provided = {}, interactive = true, featureName } = options;

  const unknown = Object.keys(provided).filter(
    (key) => !definitions.some((definition) => definition.name === key),
  );

  if (unknown.length) {
    throw new Error(`Unknown input(s) for "${featureName || 'feature'}": ${unknown.join(', ')}. Valid inputs: ${definitions.map((definition) => definition.name).join(', ') || 'none'}.`);
  }

  const values: InputValues = {};

  definitions.forEach((definition) => {
    if (!(definition.name in provided)) {
      return;
    }

    const value = provided[definition.name];

    if (definition.type === 'boolean') {
      values[definition.name] = toBoolean(definition.name, value);
    } else if (definition.required && definition.default === undefined && !`${value}`.length) {
      throw new Error(`Input "${definition.name}" cannot be empty.`);
    } else {
      values[definition.name] = `${value}`;
    }
  });

  const remaining = definitions.filter((definition) => !(definition.name in values));

  if (!remaining.length) {
    return values;
  }

  if (interactive) {
    const answers = await prompts(remaining.map((definition) => definition.question), {
      onCancel: () => handleError('User cancelled.'),
    });

    return { ...values, ...answers };
  }

  const missing = remaining.filter(
    (definition) => definition.required && definition.default === undefined,
  );

  if (missing.length) {
    throw new Error(missingInputsMessage(missing, definitions, featureName));
  }

  remaining.forEach((definition) => {
    values[definition.name] = definition.default ?? (definition.type === 'boolean' ? false : '');
  });

  return values;
}

/**
 * Collect the inputs for a YAML feature.
 */
export async function collectInputs(
  featureInputs: FeatureInput[],
  options: CollectInputsOptions = {},
): Promise<InputValues> {
  if (!featureInputs.length && !Object.keys(options.provided || {}).length) {
    logger().debug('No inputs to collect.');

    return {};
  }

  logger().debug(`Collecting ${featureInputs.length} input(s)`);

  return resolveInputs(definitionsFromFeatureInputs(featureInputs), options);
}
