import fs from 'node:fs';
import Joi from 'joi';
import yaml from 'js-yaml';

/**
 * Retrieve the structure for a scaffolder configuration file for validation
 * with Joi.
 */
const configurationSchema = () => Joi.object({
  sources: Joi.array().items(Joi.alternatives([
    Joi.string(),
    Joi.object({
      directory: Joi.string(),
      github: Joi.string(),
      git: Joi.string(),
    }).xor('directory', 'github', 'git'),
  ])),
});

/**
 * Retrieve the structure for a scaffolder feature configuration file for
 * validation with Joi.
 */
const featureConfigSchema = () => Joi.object({
  name: Joi.string(),
  type: Joi.string().default('file').valid('file', 'repository'),
  inputs: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    type: Joi.string().valid('string', 'boolean').required(),
    default: Joi.any(),
  })),
  files: Joi.array().items(Joi.object({
    source: Joi.string().required(),
    destination: Joi.string().required(),
    if: Joi.string(),
  })).when('type', {
    is: 'file',
    then: Joi.required(),
  }),
  repository: Joi.object({
    github: Joi.string(),
    git: Joi.string(),
    destination: Joi.string(),
  }).when('type', {
    is: 'repository',
    then: Joi.required(),
  }),
});

/**
 * Parse the YAML configuration.
 */
export async function parseYamlFile<TData extends object>(filePath: string): Promise<TData> {
  // Ensure this is a YAML file.
  if (!filePath.endsWith('.yml')) {
    throw new Error('The configuration file must be a YAML file.');
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`The configuration file does not exist: ${filePath}`);
  }

  return yaml.load(fs.readFileSync(filePath, 'utf8')) as TData;
}

/**
 * Validate the root/project configuration.
 */
export function validateConfiguration(config: object) {
  const { error } = configurationSchema().validate(config);

  if (error) {
    throw error;
  }
}

/**
 * Validate the feature configuration.
 */
export function validateFeatureConfiguration(config: object) {
  const { error } = featureConfigSchema().validate(config);

  if (error) {
    throw error;
  }
}
