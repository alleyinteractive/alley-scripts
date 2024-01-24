import * as fs from 'fs';
import path from 'path';

import { resetConfiguration } from '../configuration';
import { getConfiguredSources } from './sources';

jest.mock('fs');

const projectRoot = path.resolve(__dirname, '../../..');
console.log('projectRoot', projectRoot);

describe('discover/sources', () => {
  beforeEach(() => {
    delete process.env.SCAFFOLDER_HOME;

    jest.resetAllMocks();
    resetConfiguration();
  });

  it('should get the configured source directories and the current directory', async () => {
    resetConfiguration({
      sources: [],
    }, {
      sources: [
        `${projectRoot}/__tests__/fixtures/features`,
      ],
    });

    (fs.existsSync as jest.Mock).mockReturnValue(true);

    expect(await getConfiguredSources(process.cwd())).toEqual([
      {
        directory: `${process.cwd()}/.scaffolder`,
      },
      {
        directory: `${projectRoot}/__tests__/fixtures/features`,
      },
    ]);
  });

  it('should be able to resolve relative paths when discovering features', async () => {
    // Expecting the current directory to be the root of the scaffolder project.
    resetConfiguration({
      sources: [],
    }, {
      sources: [
        './__tests__/fixtures/features',
      ],
    });

    (fs.existsSync as jest.Mock).mockReturnValue(false);

    expect(await getConfiguredSources(process.cwd())).toEqual([
      {
        directory: path.resolve(__dirname, '../../../__tests__/fixtures/features'),
      },
    ]);
  });

  it('should resolve relative paths to the global configuration directory', async () => {
    process.env.SCAFFOLDER_HOME = '/scaffolder/dir';

    resetConfiguration({
      sources: [
        './example-dir',
      ],
    }, {
      sources: [
        // Relative to the scaffolder project root.
        './__tests__/fixtures/features',
      ],
    });

    (fs.existsSync as jest.Mock).mockReturnValue(false);

    expect(await getConfiguredSources(process.cwd())).toEqual([
      {
        directory: '/scaffolder/dir/example-dir',
      },
      {
        directory: `${projectRoot}/__tests__/fixtures/features`,
      },
    ]);
  });
});
