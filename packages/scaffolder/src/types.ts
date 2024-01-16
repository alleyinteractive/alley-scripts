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
  default?: any;
  description?: string;
  name: string;
  required?: boolean;
  type?: 'string' | 'boolean';
};

/**
 * Type representation of the parsed configuration of a feature.
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
  config: FeatureConfig;
  name: string;
  path: string;
};
