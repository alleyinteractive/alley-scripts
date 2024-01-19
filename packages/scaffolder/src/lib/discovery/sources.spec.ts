import * as fs from 'fs';
import path from 'path';

import { resetConfiguration } from '../configuration';
import { getSourceDirectories } from './sources';

jest.mock('fs');

describe('discover/sources', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    resetConfiguration();
  });

  it('should get the configured source directories and the current directory', async () => {
    resetConfiguration({
      sources: [],
    }, {
      sources: [
        path.resolve(__dirname, '../../../__tests__/fixtures/features'),
      ],
    });

    (fs.existsSync as jest.Mock).mockReturnValue(true);

    expect(await getSourceDirectories(process.cwd())).toEqual([
      `${process.cwd()}/.scaffolder`,
      path.resolve(__dirname, '../../../__tests__/fixtures/features'),
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

    expect(await getSourceDirectories(process.cwd())).toEqual([
      path.resolve(__dirname, '../../../__tests__/fixtures/features'),
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

    expect(await getSourceDirectories(process.cwd())).toEqual([
      '/scaffolder/dir/example-dir',
      path.resolve(__dirname, '../../../__tests__/fixtures/features'),
    ]);
  });
});
