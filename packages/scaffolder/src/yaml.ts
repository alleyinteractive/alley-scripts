import fs from 'node:fs';
import Joi from 'joi';
import yaml from 'js-yaml';

const githubSchema = Joi.alternatives(
  Joi.string(),
  Joi.object({
    github: Joi.string(),
    name: Joi.string(),
    url: Joi.string(),
    directory: Joi.string(),
    ref: Joi.string(),
  }).xor('github', 'name', 'url'),
);

const gitSchema = Joi.alternatives(
  Joi.string(),
  Joi.object({
    git: Joi.string(),
    url: Joi.string(),
    directory: Joi.string(),
    ref: Joi.string(),
  }).xor('git', 'url'),
);

/**
 * Retrieve the structure for a scaffolder feature configuration file for
 * validation with Joi.
 */
const featureConfigSchema = () => Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  type: Joi.string().default('file').valid('composer', 'file', 'repository'),
  config: Joi.object({
    'destination-resolver': Joi.string().valid('cwd', 'theme', 'plugin', 'relative', 'relative-parent').default('cwd'),
  }),
  inputs: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    type: Joi.string().valid('string', 'boolean').required(),
    default: Joi.any(),
  })),
  files: Joi.array().items(Joi.object({
    source: Joi.string().required(),
    destination: Joi.string(),
    base: Joi.string(),
    if: Joi.string(),
  })).when('type', {
    is: 'file',
    then: Joi.required(),
  }),
  repository: Joi.object({
    github: githubSchema,
    git: gitSchema,
    destination: Joi.string().required(),
    postCloneCommand: Joi.string(),
  }).when('type', {
    is: 'repository',
    then: Joi.required(),
  }),
  composer: Joi.object({
    package: Joi.string().required(),
    destination: Joi.string().required(),
    version: Joi.string(),
    args: Joi.string(),
    postCommand: Joi.string(),
  }).when('type', {
    is: 'composer',
    then: Joi.required(),
  }),
});

/**
 * Retrieve the structure for a scaffolder configuration file for validation
 * with Joi.
 */
const configurationSchema = () => Joi.object({
  sources: Joi.array().items(Joi.alternatives([
    Joi.string(),
    Joi.object({
      directory: Joi.string(),
      github: githubSchema,
      git: gitSchema,
    }).xor('directory', 'github', 'git'),
  ])),
  features: Joi.array().items(featureConfigSchema()),
});

/**
 * Parse the YAML configuration.
 */
export function parseYamlFile<TData extends object>(filePath: string): TData {
  // Ensure this is a YAML file.
  if (!filePath.endsWith('.yml') && !filePath.endsWith('.yaml')) {
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
