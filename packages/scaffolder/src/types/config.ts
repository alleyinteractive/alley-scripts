/* eslint-disable max-len */
import type { GitConfig, GitHubConfig } from './remoteSource';
import type { Source } from './source';

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
  /* Destination location. */
  destination?: string;
  /* Condition to check if the file should be generated. */
  if?: string;
  /* Base directory for the source file. */
  base?: string;
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
 * @todo Add support for directory support when cloning a repository.
 */
export type FeatureRepositoryConfig = {
  /* Destination directory for the repository. */
  destination: string;
  /* Git URL for the repository. */
  git?: string | GitConfig;
  /* GitHub configuration for the repository. */
  github?: string | GitHubConfig;
  /* Command to run after the repository is cloned. */
  postCloneCommand?: string;
};

export type FeatureComposerConfig = {
  /* Arguments to pass to the composer command. */
  args?: string;
  /* Name of the package to install. */
  package: string;
  /* Destination directory for the repository. */
  destination: string;
  /* Version of the package to install. */
  version?: string;
  /* Command to run after the project is done scaffolding. */
  postCommand?: string;
};

/**
 * Type representation of the parsed configuration of a feature.
 *
 * This exists in the .scaffolder/<feature>/config.yml file.
 */
export type FeatureConfig = {
  name: string;
  description?: string;
  type: 'file' | 'repository' | 'composer' | 'composite';
  config?: {
    /* Defaults to 'cwd'. */
    'destination-resolver'?: 'cwd' | 'theme' | 'plugin' | 'relative' | 'relative-parent';
  };
  composer?: FeatureComposerConfig;
  composite?: {
    features: FeatureConfig[];
    /* Command to run after the project is done scaffolding. */
    postCommand?: string;
  };
  files?: FeatureFile[];
  inputs?: FeatureInput[];
  repository?: FeatureRepositoryConfig;
};
