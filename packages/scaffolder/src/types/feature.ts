export type FeatureContext = {
  feature: {
    /* Name of the feature. */
    name: string;
  };
  inputs: Record<string, any>;
};
