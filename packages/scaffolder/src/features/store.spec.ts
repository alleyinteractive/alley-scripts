import path from 'path';
import { ConfigurationStore } from '../configuration/store';
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

    expect(Object.keys(items)).toEqual([
      __dirname,
      `${fixturesPath}/a-features/feature-a`,
      `${fixturesPath}/a-features/feature-b`,
    ]);

    expect(items[__dirname]).toEqual([{ // eslint-disable-line no-underscore-dangle
      name: 'manually-configured-feature',
      type: 'file',
    }]);
  });
});
