import { collectInputs } from './helpers.js';
import { Feature } from './types.js';

/**
 * Process a feature and scaffold the files.
 */
export default async function processFeature(rootDir: string, feature: Feature) {
  console.log('feature', feature);

  const inputs = await collectInputs(feature);

  console.log('inputs', inputs);

  // Go through each file and generate the file from the calculated inputs.

  // Put the file in the new location.
}
