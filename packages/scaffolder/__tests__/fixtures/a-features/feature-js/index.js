import { Feature } from '../../../../src';

class CustomFeature extends Feature {
  async invoke() {

  }
}

/** @type {import('../../../../src').FeatureConfig} */
export default {
  name: 'feature-js',
  type: CustomFeature,
  inputs: [
    {
      name: 'name',
      type: 'string',
    },
  ],
};
