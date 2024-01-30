import { Source } from './source';

/**
 * Type representation of the parsed root configuration.
 *
 * This file can exists globally in ~/.scaffolder/config.yml or in a project at
 * .scaffolder/config.yml file. Both are optional.
 */
export type Configuration = {
  features?: FeatureConfig[];
  sources?: (Source | string)[];
};

/**
 * Type representation of the parsed configuration of file from a feature
 * configuration file (the files attribute in a feature config.yml file).
 */
export type FeatureFile = {
  /* Source file or glob pattern. */
  source: string;
  /* Destination file. For folders, this is the base folder. */
  destination: string;
  /* Condition to check if the file should be generated. */
  if?: string;
};

/**
 * Type representation of the parsed configuration of a feature input.
 *
 * @todo Add support for more input types.
 */
export type FeatureInput = {
  /* Default value of the input. Defaults to an empty string. */
  default?: any;
  /* Description of the input. */
  description?: string;
  /* Name of the input. */
  name: string;
  /* Whether the input is required. Defaults to true. */
  required?: boolean;
  /* Type of the input. Defaults to string. */
  type?: 'string' | 'boolean';
};

/**
 * Type representation of the parsed configuration of a feature.
 *
 * This exists in the .scaffolder/<feature>/config.yml file.
 */
export type FeatureConfig = {
  name: string;
  type: 'file' | 'repository';
  files: FeatureFile[];
  inputs: FeatureInput[];
};
