import * as fs from 'node:fs';

import { clearProjectDirectory, getGlobalDirectory, resetConfiguration } from '../configuration';
import { getLookupSources } from './sources';

jest.mock('node:fs');

describe('discover/sources', () => {
  beforeEach(() => {
    delete process.env.SCAFFOLDER_HOME;

    jest.resetAllMocks();
    resetConfiguration();
    clearProjectDirectory();
  });

  it('should get the configured source directories', async () => {
    resetConfiguration({
      sources: [
        './global-configuration',
      ],
    }, {
      sources: [
        './__tests__/fixtures/z-features',
      ],
    });

    (fs.existsSync as jest.Mock).mockReturnValue(true);

    const globalConfigDir = getGlobalDirectory();

    expect(await getLookupSources()).toEqual([
      // The project scaffolder directory is always included.
      {
        directory: `${process.cwd()}/.scaffolder`,
        root: process.cwd(),
      },
      // Default configuration -- global configuration directory.
      {
        directory: globalConfigDir,
        root: globalConfigDir,
      },
      // Default configuration -- project configuration directory.
      {
        directory: './__tests__/fixtures/a-features',
        root: process.cwd(),
      },
      // Root configuration.
      {
        directory: './global-configuration',
        root: globalConfigDir,
      },
      // Project configuration.
      {
        directory: './__tests__/fixtures/z-features',
        root: `${process.cwd()}/.scaffolder`,
      },
    ]);
  });
});
