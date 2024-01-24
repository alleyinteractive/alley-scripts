export type FeatureContext = {
  feature: {
    /* Name of the feature. */
    name: string;
    /* Path to the feature directory. */
    path: string;
  };
  inputs: Record<string, any>;
};
