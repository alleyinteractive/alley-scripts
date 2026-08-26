import { configToGenerator } from './configToGenerator';

describe('configToGenerator', () => {
  it('rejects JavaScript features until their generator is implemented', () => {
    expect(() => configToGenerator({
      type: 'javascript',
      name: 'extension-feature',
      generate() {},
    }, '/extensions')).toThrow('invalid type');
  });
});
