import path from 'node:path';
import { Generator } from './generator';
import { logger } from '../logger';
import type { FeatureConfig } from '../types';

class TestGenerator extends Generator {
  public async invoke(): Promise<void> {
    await Promise.resolve(this.config);
  }
}

describe('generators/generator', () => {
  it('provides the extension runtime context', () => {
    const featureDirectory = '/tmp/scaffolder-feature';
    const config: FeatureConfig = {
      name: 'post-type',
      description: 'Creates a post type.',
      type: 'file',
      config: { 'destination-resolver': 'relative' },
    };
    const generator = new TestGenerator(config, featureDirectory);
    generator.inputs = { plural: 'Posts' };
    generator.dryRun = true;

    const context = generator.collectContextVariables();

    expect(context.feature.description).toBe('Creates a post type.');
    expect(context.dryRun).toBe(true);
    expect(context.featureDirectory).toBe(featureDirectory);
    expect(context.resolveDestination('src/post-types.ts')).toBe(path.resolve(featureDirectory, 'src/post-types.ts'));
    expect(context.logger).toBe(logger());
  });
});
