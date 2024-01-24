import * as fs from 'fs';
import path from 'path';
import { load } from 'js-yaml';

import {
  getGlobalConfiguration,
  getGlobalConfigurationDir,
  getProjectConfiguration,
  getScaffolderRoot,
  resetConfiguration,
} from './configuration';
import { validateConfiguration, validateFeatureConfiguration } from './yaml';
import { DEFAULT_CONFIGURATION } from './defaultConfiguration';

jest.mock('fs');

const rootDir = path.resolve(__dirname, '../..');

describe('configuration', () => {
  beforeEach(() => {
    delete process.env.SCAFFOLDER_HOME;

    jest.resetAllMocks();
    resetConfiguration();
  });

  it('should locate the scaffolder root if .scaffolder exists in current directory', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    expect(await getScaffolderRoot()).toEqual(process.cwd());
  });

  it('should locate the scaffolder root if .scaffolder exists in parent directory', async () => {
    (fs.existsSync as jest.Mock)
      .mockReturnValueOnce(false)
      .mockReturnValue(true);

    expect(await getScaffolderRoot()).toEqual(path.resolve(process.cwd(), '..'));
  });

  it('should get the global configuration directory', () => {
    expect(getGlobalConfigurationDir()).toEqual(`${process.env.HOME}/.scaffolder`);

    process.env.SCAFFOLDER_HOME = '/scaffolder/dir';

    expect(getGlobalConfigurationDir()).toEqual('/scaffolder/dir');

    delete process.env.SCAFFOLDER_HOME;

    expect(getGlobalConfigurationDir()).toEqual(`${process.env.HOME}/.scaffolder`);
  });

  it('should get the default configuration when no global configuration exists', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    expect(await getGlobalConfiguration()).toEqual(DEFAULT_CONFIGURATION);
  });

  it('should get the global configuration', async () => {
    process.env.SCAFFOLDER_HOME = '/scaffolder/dir';

    (fs.existsSync as jest.Mock).mockReturnValue(true);

    (fs.readFileSync as jest.Mock).mockReturnValue(`
sources:
  # Check another directory in the project for features. Supports both formats.
  - directory: ../project-features
  - ./another-project-features

  # Check a remote repository for features.
  - github: alleyinteractive/scaffolder-features
    `);

    expect(await getGlobalConfiguration()).toEqual({
      sources: [
        // Default configuration.
        {
          root: rootDir,
          directory: './__tests__/fixtures/a-features',
        },
        // Root configuration from above mock.
        {
          directory: '../project-features',
        },
        './another-project-features',
        {
          github: 'alleyinteractive/scaffolder-features',
        },
      ],
    });
  });

  it('should get the project configuration with the global merged in', async () => {
    process.env.SCAFFOLDER_HOME = '/scaffolder';

    (fs.existsSync as jest.Mock).mockReturnValue(true);

    // Project configuration.
    (fs.readFileSync as jest.Mock)
      .mockReturnValueOnce(`
sources:
  - ./project-dir
  - directory: ./another-project-dir
    `)

    // Global configuration.
      .mockReturnValueOnce(`
sources:
  - ./global-dir
    `);

    expect(await getProjectConfiguration('/project')).toEqual({
      root: {
        location: getGlobalConfigurationDir(),
        config: {
          sources: [
            {
              directory: './__tests__/fixtures/a-features',
              root: rootDir,
            },
            './global-dir',
          ],
        },
      },
      project: {
        location: '/project/.scaffolder',
        config: {
          sources: [
            './project-dir',
            {
              directory: './another-project-dir',
            },
          ],
        },
      },
    });
  });

  const invalidConfigurations = [
    `
sources:
  - unknown: value
`,
    'unknown_key: value',
    `
sources:
  - false
`,
    `
sources:
  - ./project-dir

unknown_key: value
`,
    `
sources:
  - directory: ./project-dir
    github: alleyinteractive/scaffolder-features
`,
  ];

  it.each(invalidConfigurations)('should throw an error for invalid configuration', (configuration) => {
    expect(() => validateConfiguration(load(configuration) as object)).toThrow();
  });

  const invalidFeatureConfigurations = [
    `
name: test

inputs:
  - name: test
    type: string
    `,
    `
name: test

files:
  - source: test
    `,
    'name: test',
    `
name: test

unknown_key: value
    `,
  ];

  it.each(invalidFeatureConfigurations)('should throw an error for invalid feature configuration', (configuration) => {
    expect(() => validateFeatureConfiguration(load(configuration) as object)).toThrow();
  });
});
