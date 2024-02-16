import path from 'node:path';

import { getGlobalDirectory } from './globalDirectory';
import { ConfigurationStore } from './store';

describe('configuration/store', () => {
  it('should be able to load the global configuration by default', () => {
    const store = new ConfigurationStore();
    store.loadFromPath(__dirname);

    expect(store.all()).toEqual({
      [`${getGlobalDirectory()}`]: expect.anything(),
    });
  });

  it('should be able to load sources from a path', () => {
    const sourcePath = path.resolve(__dirname, '../../__tests__/fixtures/sources');
    const store = new ConfigurationStore();
    store.loadFromPath(sourcePath);

    expect(store.all()).toEqual({
      [`${sourcePath}/.scaffolder`]: expect.anything(),
      [`${getGlobalDirectory()}`]: expect.anything(),
    });

    expect(store.pluck('sources')[`${sourcePath}/.scaffolder`]).toEqual([
      '../a-features',
    ]);
  });
});
