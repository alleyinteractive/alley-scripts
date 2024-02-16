import simpleGit from 'simple-git';
import fs from 'node:fs';

import {
  getCheckoutBaseDirectory,
  processGitHubSource,
  processGitSource,
  remoteSourceToLocalDirectory,
} from './remoteSources';

const simpleGitMock = {
  checkout: jest.fn(),
  clean: jest.fn(),
  clone: jest.fn(),
  fetch: jest.fn(),
  pull: jest.fn(),
  status: jest.fn(() => ({
    current: 'master',
  })),
};

jest.mock('node:fs');
jest.mock('simple-git', () => jest.fn(() => simpleGitMock));

describe('remoteSources', () => {
  const baseDir = getCheckoutBaseDirectory();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each([
    [
      {
        github: 'alleyinteractive/scaffolder-features',
      },
      `${baseDir}/github/alleyinteractive/scaffolder-features`,
    ],
    [
      {
        github: {
          name: 'alleyinteractive/scaffolder-features',
        },
      },
      `${baseDir}/github/alleyinteractive/scaffolder-features`,
    ],
    [
      {
        // Support YAML object keys with dashes
        github: {
          github: 'alleyinteractive/scaffolder-features',
        },
      },
      `${baseDir}/github/alleyinteractive/scaffolder-features`,
    ],
    [
      {
        github: 'alleyinteractive/scaffolder-features#abc1234',
      },
      `${baseDir}/github/alleyinteractive/scaffolder-features`,
    ],
    [
      {
        github: {
          name: 'alleyinteractive/scaffolder-features',
          ref: 'abc1234',
        },
      },
      `${baseDir}/github/alleyinteractive/scaffolder-features`,
    ],
    [
      {
        github: 'git@github.com:alleyinteractive/example-repository.git',
      },
      `${baseDir}/github/alleyinteractive/example-repository`,
    ],
    [
      {
        github: {
          url: 'git@github.com:alleyinteractive/example-repository.git',
        },
      },
      `${baseDir}/github/alleyinteractive/example-repository`,
    ],
    [
      {
        github: 'https://github.com/example-org/example-repo0_1',
      },
      `${baseDir}/github/example-org/example-repo0-1`,
    ],
    [
      {
        github: 'https://github.com/example-org/example-repo0_1.git',
      },
      `${baseDir}/github/example-org/example-repo0-1`,
    ],
  ])('GitHub: remoteSourceToLocalDirectory(%j) returns %s', (source, expected) => {
    expect(remoteSourceToLocalDirectory(source)).toEqual(expected);
  });

  it('should be able handle errors when parsing GitHub URLs', () => {
    expect(() => remoteSourceToLocalDirectory({
      github: 'invalid url',
    })).toThrow('Invalid GitHub URL: invalid url');

    expect(() => remoteSourceToLocalDirectory({
      github: 'https://github.com/example-org',
    })).toThrow('Invalid GitHub URL: https://github.com/example-org');
  });

  test.each([
    [
      {
        git: 'git@github.com:alleyinteractive/example.git',
      },
      `${getCheckoutBaseDirectory()}/git/github-com/alleyinteractive/example-git`,
    ],
    [
      {
        git: 'https://bitbucket.com/alleyinteractive/other-example.git',
      },
      `${getCheckoutBaseDirectory()}/git/bitbucket-com/alleyinteractive/other-example-git`,
    ],
    [
      {
        git: {
          git: 'https://bitbucket.com/alleyinteractive/other-example.git',
        },
      },
      `${getCheckoutBaseDirectory()}/git/bitbucket-com/alleyinteractive/other-example-git`,
    ],
    [
      {
        git: {
          url: 'https://bitbucket.com/alleyinteractive/other-example.git',
        },
      },
      `${getCheckoutBaseDirectory()}/git/bitbucket-com/alleyinteractive/other-example-git`,
    ],
    [
      {
        git: 'https://bitbucket.com/alleyinteractive/other-example.git#master',
      },
      `${getCheckoutBaseDirectory()}/git/bitbucket-com/alleyinteractive/other-example-git`,
    ],
  ])('Git: remoteSourceToLocalDirectory(%j) returns %s', (source, expected) => {
    expect(remoteSourceToLocalDirectory(source)).toEqual(expected);
  });

  it('should be able to handle errors when parsing Git URLs', () => {
    expect(() => remoteSourceToLocalDirectory({
      git: 'invalid url',
    })).toThrow('Invalid Git URL: invalid url');
  });

  // Test each of the different ways to define a git source.
  test.each([
    [
      {
        git: 'https://github.com/alleyinteractive/example-generators.git',
      },
      {
        baseDir: `${getCheckoutBaseDirectory()}/git/github-com/alleyinteractive/example-generators-git`,
      },
    ],
    [
      {
        git: {
          git: 'https://github.com/alleyinteractive/example-generators.git',
        },
      },
      {
        baseDir: `${getCheckoutBaseDirectory()}/git/github-com/alleyinteractive/example-generators-git`,
      },
    ],
    [
      {
        git: {
          url: 'https://github.com/alleyinteractive/example-generators.git',
        },
      },
      {
        baseDir: `${getCheckoutBaseDirectory()}/git/github-com/alleyinteractive/example-generators-git`,
      },
    ],
  ])('Git: processGitSource(%j) returns %j', async (source, expected) => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    simpleGitMock.clone.mockResolvedValue('');

    await processGitSource(source);

    // Only check the baseDir object property. the rest is tested in the simple-git package.
    expect(simpleGit).toHaveBeenCalledWith(
      expect.objectContaining(expected),
    );
    expect(simpleGitMock.clone).toHaveBeenCalledTimes(1);
    expect(simpleGitMock.pull).not.toHaveBeenCalled();
    expect(simpleGitMock.checkout).not.toHaveBeenCalled();
  });

  it('should be able to checkout a new git repository with a specific branch', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    await processGitSource({
      git: 'https://github.com/alleyinteractive/example-generators.git#8defe001',
    });

    expect(simpleGit).toHaveBeenCalledWith(
      expect.objectContaining({
        baseDir: `${getCheckoutBaseDirectory()}/git/github-com/alleyinteractive/example-generators-git`,
      }),
    );

    expect(simpleGitMock.clone).toHaveBeenCalledTimes(1);
    expect(simpleGitMock.pull).not.toHaveBeenCalled();
    expect(simpleGitMock.checkout).toHaveBeenCalledWith('8defe001');
  });

  it('should be able to checkout a new git repository with a specific branch and subdirectory', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true).mockReturnValueOnce(false);

    const result = await processGitSource({
      git: {
        url: 'https://github.com/alleyinteractive/example-generators.git#8defe001',
        ref: 'asd3223',
        directory: 'subdirectory/path/here',
      },
    });

    expect(result).toEqual({
      directory: `${getCheckoutBaseDirectory()}/git/github-com/alleyinteractive/example-generators-git/subdirectory/path/here`,
    });

    expect(simpleGit).toHaveBeenCalledWith(
      expect.objectContaining({
        baseDir: `${getCheckoutBaseDirectory()}/git/github-com/alleyinteractive/example-generators-git`,
      }),
    );

    expect(simpleGitMock.clone).toHaveBeenCalledTimes(1);
    expect(simpleGitMock.pull).not.toHaveBeenCalled();
    expect(simpleGitMock.checkout).toHaveBeenCalledWith('asd3223');
  });

  it('should be able to update an existing git repository', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.statSync as jest.Mock).mockReturnValue({
      mtimeMs: Date.now() - 9600000,
    });

    await processGitSource({
      git: 'https://github.com/alleyinteractive/example-update-generators.git#8defe001',
    });

    expect(simpleGit).toHaveBeenCalledWith(
      expect.objectContaining({
        baseDir: `${getCheckoutBaseDirectory()}/git/github-com/alleyinteractive/example-update-generators-git`,
      }),
    );

    expect(simpleGitMock.clone).not.toHaveBeenCalledTimes(1);
    expect(simpleGitMock.fetch).toHaveBeenCalled();
    expect(simpleGitMock.checkout).toHaveBeenCalledWith('8defe001');
  });

  it('should not update an existing git repository if it was updated recently', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.statSync as jest.Mock).mockReturnValue({
      mtimeMs: Date.now() - 10,
    });

    await processGitSource({
      git: 'https://github.com/alleyinteractive/example-update-generators.git#8defe001',
    });

    expect(simpleGit).toHaveBeenCalled();
    expect(simpleGitMock.status).toHaveBeenCalled();
    expect(simpleGitMock.fetch).not.toHaveBeenCalled();
  });

  // Test each of the different ways to define a github source.
  test.each([
    [
      {
        github: 'alleyinteractive/example-generators',
      },
      {
        baseDir: `${getCheckoutBaseDirectory()}/github/alleyinteractive/example-generators`,
      },
    ],
    [
      {
        github: {
          name: 'alleyinteractive/example-generators',
        },
      },
      {
        baseDir: `${getCheckoutBaseDirectory()}/github/alleyinteractive/example-generators`,
      },
    ],
    [
      {
        github: {
          github: 'alleyinteractive/example-generators',
        },
      },
      {
        baseDir: `${getCheckoutBaseDirectory()}/github/alleyinteractive/example-generators`,
      },
    ],
  ])('GitHub: processGitHubSource(%j) returns %j', async (source, expected) => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    await processGitHubSource(source);

    expect(simpleGit).toHaveBeenCalledWith(
      expect.objectContaining(expected),
    );

    expect(simpleGitMock.clone).toHaveBeenCalledTimes(1);
    expect(simpleGitMock.pull).not.toHaveBeenCalled();
    expect(simpleGitMock.checkout).not.toHaveBeenCalled();
  });

  it('should be able to checkout a github repository with a specific ref', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true).mockReturnValueOnce(false);

    const result = await processGitHubSource({
      github: 'alleyinteractive/example-generators#8defe001',
    });

    expect(result).toEqual({
      directory: `${getCheckoutBaseDirectory()}/github/alleyinteractive/example-generators`,
    });

    expect(simpleGit).toHaveBeenCalledWith(
      expect.objectContaining({
        baseDir: `${getCheckoutBaseDirectory()}/github/alleyinteractive/example-generators`,
      }),
    );

    expect(simpleGitMock.clone).toHaveBeenCalledTimes(1);
    expect(simpleGitMock.pull).not.toHaveBeenCalled();
    expect(simpleGitMock.checkout).toHaveBeenCalledWith('8defe001');
  });

  it('should be able to checkout a github repository with a specific ref and subdirectory', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true).mockReturnValueOnce(false);

    const result = await processGitHubSource({
      github: {
        name: 'alleyinteractive/example-generators',
        ref: 'asd3223',
        directory: 'subdirectory/path/here',
      },
    });

    expect(result).toEqual({
      directory: `${getCheckoutBaseDirectory()}/github/alleyinteractive/example-generators/subdirectory/path/here`,
    });

    expect(simpleGit).toHaveBeenCalledWith(
      expect.objectContaining({
        baseDir: `${getCheckoutBaseDirectory()}/github/alleyinteractive/example-generators`,
      }),
    );

    expect(simpleGitMock.clone).toHaveBeenCalledTimes(1);
    expect(simpleGitMock.pull).not.toHaveBeenCalled();
    expect(simpleGitMock.checkout).toHaveBeenCalledWith('asd3223');
  });

  it('should throw an error if the subdirectory does not exist', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    await expect(processGitHubSource({
      github: {
        name: 'alleyinteractive/example-generators',
        ref: 'asd3223',
        directory: 'invalid-subdirectory',
      },
    })).rejects.toThrow('The subdirectory invalid-subdirectory does not exist in the cloned repository');
  });

  it('should be able to update an existing github repository', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.statSync as jest.Mock).mockReturnValue({
      mtimeMs: Date.now() - 9600000,
    });

    await processGitHubSource({
      github: 'alleyinteractive/example-update-generators#8defe001',
    });

    expect(simpleGit).toHaveBeenCalledWith(
      expect.objectContaining({
        baseDir: `${getCheckoutBaseDirectory()}/github/alleyinteractive/example-update-generators`,
      }),
    );

    expect(simpleGitMock.clone).not.toHaveBeenCalledTimes(1);
    expect(simpleGitMock.fetch).toHaveBeenCalled();
    expect(simpleGitMock.checkout).toHaveBeenCalledWith('8defe001');
  });
});
