import { featureToGenerator } from './configToGenerator';
import { JavaScriptGenerator } from '../generators';

describe('configToGenerator', () => {
  it('creates a JavaScript generator for a JavaScript feature', () => {
    const generator = featureToGenerator({
      type: 'javascript',
      name: 'extension-feature',
      generate: async () => {},
    }, '/extensions');

    expect(generator).toBeInstanceOf(JavaScriptGenerator);
  });
});
