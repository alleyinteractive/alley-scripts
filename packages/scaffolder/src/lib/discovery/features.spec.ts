import path from 'path';

import { resetConfiguration } from '../configuration';
import { getFeatures } from './features';

const fixturesDirectory = path.resolve(__dirname, '../../../__tests__/fixtures');

describe('discovery/features', () => {
  beforeEach(() => {
    delete process.env.SCAFFOLDER_HOME;

    jest.resetAllMocks();

    resetConfiguration({
      sources: [
        `${fixturesDirectory}/a-features`,
      ],
    }, {});
  });

  it('should be able to discover local features', async () => {
    const features = await getFeatures(process.cwd());

    expect(features).toHaveLength(2);
    expect(features[0].config.name).toEqual('Test Feature A');
    expect(features[0].configPath).toEqual(`${fixturesDirectory}/a-features/feature-a/config.yml`);
    expect(features[0].path).toEqual(`${fixturesDirectory}/a-features/feature-a`);

    expect(features[1].config.name).toEqual('Test Feature B');
    expect(features[1].configPath).toEqual(`${fixturesDirectory}/a-features/feature-b/config.yml`);
    expect(features[1].path).toEqual(`${fixturesDirectory}/a-features/feature-b`);
  });

  it('should be able to discover global and local features', async () => {
    resetConfiguration({
      sources: [
        `${fixturesDirectory}/a-features`,
      ],
    }, {
      sources: [
        `${fixturesDirectory}/z-features`,
      ],
    });

    const features = await getFeatures(process.cwd());

    expect(features).toHaveLength(3);

    expect(features[0].config.name).toEqual('Test Feature A');
    expect(features[1].config.name).toEqual('Test Feature B');
    expect(features[2].config.name).toEqual('Feature Set Two: Feature A');
  });
});
