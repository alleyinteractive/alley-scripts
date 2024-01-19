import * as fs from 'fs';
import path from 'path';

import { resetConfiguration } from '../configuration';
import { getFeatures } from '.';

// jest.mock('fs');

const fixturesDirectory = path.resolve(__dirname, '../../../__tests__/fixtures');

describe('discovery/features', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    resetConfiguration({
      sources: [
        `${fixturesDirectory}/features`,
      ],
    }, {});
  });

  it('should be able to discover local features', async () => {
    const features = await getFeatures(process.cwd());

    expect(features).toHaveLength(2);
    expect(features[0].config.name).toEqual('Test Feature A');
    expect(features[0].path).toEqual(`${fixturesDirectory}/features/feature-a`);

    expect(features[1].config.name).toEqual('Test Feature B');
    expect(features[1].path).toEqual(`${fixturesDirectory}/features/feature-b`);
  });

  it('should be able to discover global and local features', async () => {
    resetConfiguration({
      sources: [
        `${fixturesDirectory}/features`,
      ],
    }, {
      sources: [
        `${fixturesDirectory}/z-feature-set-two`,
      ],
    });

    const features = await getFeatures(process.cwd());

    expect(features).toHaveLength(3);

    expect(features[0].config.name).toEqual('Test Feature A');
    expect(features[1].config.name).toEqual('Test Feature B');
    expect(features[2].config.name).toEqual('Feature Set Two: Feature A');
  });
});
