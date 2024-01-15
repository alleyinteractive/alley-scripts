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
  name: string;
  description?: string;
  type?: 'string' | 'boolean';
  default?: any;
};

/**
 * Type representation of the parsed configuration of a feature.
 */
export type FeatureConfig = {
  name: string;
  inputs: FeatureInput[];
  files: FeatureFile[];
};

/**
 * Type representation of the parsed configuration of a feature along with
 * information about where the feature is located.
 */
export type Feature = {
  config: FeatureConfig;
  name: string;
  path: string;
};
