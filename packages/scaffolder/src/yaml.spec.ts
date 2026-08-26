import { validateFeatureConfiguration } from './yaml';

describe('validateFeatureConfiguration', () => {
  it('accepts a JavaScript hooks module on a YAML feature', () => {
    expect(() => validateFeatureConfiguration({
      name: 'post-type',
      type: 'file',
      hooks: './hooks.js',
      files: [{ source: 'post-type.stub' }],
    })).not.toThrow();
  });

  it('rejects a non-string hooks module', () => {
    expect(() => validateFeatureConfiguration({
      name: 'post-type',
      type: 'file',
      hooks: true,
      files: [{ source: 'post-type.stub' }],
    })).toThrow('"hooks" must be a string');
  });
});
