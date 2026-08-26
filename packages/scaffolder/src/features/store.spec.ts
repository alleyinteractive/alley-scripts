import path from 'path';
import { ConfigurationStore } from '../configuration/store';
import { logger } from '../logger';
import { FeatureStore } from './store';

describe('features/store', () => {
  const fixturesPath = path.resolve(__dirname, '../../__tests__/fixtures');
  const configStore = new ConfigurationStore();
  configStore.add(__dirname, {
    sources: [{
      directory: `${fixturesPath}/a-features`,
    }],
    features: [{
      name: 'manually-configured-feature',
      type: 'file',
    }],
  });

  it('should be able to load features', async () => {
    const store = new FeatureStore(configStore);
    await store.initialize();

    const items = store.all();
    const keys = Object.keys(items);

    expect(keys).toContain(__dirname);
    expect(keys).toContain(`${fixturesPath}/a-features/feature-a`);
    expect(keys).toContain(`${fixturesPath}/a-features/feature-b`);

    expect(items[__dirname]).toEqual([{ // eslint-disable-line no-underscore-dangle
      name: 'manually-configured-feature',
      type: 'file',
    }]);
  });

  it('discovers scoped and unscoped JavaScript feature packages', async () => {
    const store = new FeatureStore(new ConfigurationStore(), () => [
      path.join(fixturesPath, 'node_modules'),
    ]);
    await store.initialize();

    expect(Object.values(store.all()).flat().map(({ name }) => name)).toEqual(
      expect.arrayContaining(['plain-feature', 'first-feature', 'second-feature']),
    );
  });

  it('continues discovery when a JavaScript package cannot load', async () => {
    const warn = jest.spyOn(logger(), 'warn');
    const store = new FeatureStore(new ConfigurationStore(), () => [
      path.join(fixturesPath, 'node_modules'),
    ]);

    await store.initialize();

    expect(Object.values(store.all()).flat().map(({ name }) => name)).toEqual(
      expect.arrayContaining(['plain-feature', 'first-feature', 'second-feature']),
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('invalid-scaffolder'));
    warn.mockRestore();
  });
});
