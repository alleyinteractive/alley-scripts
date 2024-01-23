export type DirectorySource = {
  directory: string;
};

export type GithubSource = {
  /* Repository to clone from (organization/repository with an optional branch). */
  github: string;
};

/**
 * Source configuration.
 */
export type Source = DirectorySource | GithubSource;

/**
 * Type representation of the parsed root configuration.
 *
 * This exists in the .scaffolder/config.yml file and is optional.
 */
export type RootConfiguration = {
  sources?: (Source | string)[];
};

/**
 * Type representation of the parsed configuration of file from a feature
 * configuration file (the files attribute in a feature config.yml file).
 */
export type FeatureFile = {
  source: string;
  destination: string;
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
  files: FeatureFile[];
  inputs: FeatureInput[];
  name: string;
};

/**
 * Type representation of the parsed configuration of a feature along with
 * information about where the feature is located.
 */
export type Feature = {
  /* The parsed configuration file of the feature. */
  config: FeatureConfig;
  /* The directory path to the feature directory. */
  path: string;
};
