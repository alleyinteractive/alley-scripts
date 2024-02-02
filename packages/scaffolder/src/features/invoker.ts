import { Generator } from '../generators';

/**
 * Invoke a feature generator.
 */
export async function invokeFeature(generator: Generator, dryRun: boolean) {
  return generator.resolveAndInvoke(dryRun);
}
