import { configToGenerator, featureToGenerator } from './configToGenerator';
import {
  ComposerGenerator,
  FileGenerator,
  Generator,
  JavaScriptGenerator,
  RepositoryGenerator,
} from '../generators';
import type { FeatureConfig } from '../types';

describe('configToGenerator', () => {
  it('creates a JavaScript generator for a JavaScript feature', () => {
    const generator = featureToGenerator({
      type: 'javascript',
      name: 'extension-feature',
      generate: async () => {},
    }, '/extensions');

    expect(generator).toBeInstanceOf(JavaScriptGenerator);
  });

  it.each([
    ['file', FileGenerator],
    ['repository', RepositoryGenerator],
    ['composer', ComposerGenerator],
  ] as const)('keeps configToGenerator routing %s YAML features', (type, ExpectedGenerator) => {
    const config: FeatureConfig = { name: `${type}-feature`, type };
    const generator: Generator<FeatureConfig> = configToGenerator(config, '/features');

    expect(generator).toBeInstanceOf(ExpectedGenerator);
    expect(generator.config).toBe(config);
  });
});
