import * as fs from 'fs';
import {
  DEFAULT_CONFIGURATION,
  getGlobalConfiguration,
  getGlobalConfigurationDir,
  getProjectConfiguration,
  resetConfiguration,
} from './configuration';

jest.mock('fs');

describe('configuration', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    resetConfiguration();
  });

  it('should get the global configuration directory', () => {
    expect(getGlobalConfigurationDir()).toEqual(`${process.env.HOME}/.scaffolder`);

    process.env.SCAFFOLDER_HOME = '/scaffolder/dir';

    expect(getGlobalConfigurationDir()).toEqual('/scaffolder/dir');
  });

  it('should get the default configuration when no global configuration exists', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    expect(await getGlobalConfiguration()).toEqual(DEFAULT_CONFIGURATION);
  });

  it('should get the global configuration', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    (fs.readFileSync as jest.Mock).mockReturnValue(`
sources:
  # Check another directory in the project for features. Supports both formats.
  - directory: ../project-features
  - ../another-project-features

  # Check a remote repository for features.
  - github: alleyinteractive/scaffolder-features
    `);

    expect(await getGlobalConfiguration()).toEqual({
      sources: [
        {
          directory: '../project-features',
        },
        '../another-project-features',
        {
          github: 'alleyinteractive/scaffolder-features',
        },
      ],
    });
  });

  it('should get the project configuration with the global merged in', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    // Project configuration.
    (fs.readFileSync as jest.Mock)
      .mockReturnValueOnce(`
sources:
  - ./project-dir
    `)

    // Global configuration.
      .mockReturnValueOnce(`
sources:
  - ./global-dir
    `);

    expect(await getProjectConfiguration('./')).toEqual({
      sources: [
        './global-dir',
        './project-dir',
      ],
    });
  });
});
