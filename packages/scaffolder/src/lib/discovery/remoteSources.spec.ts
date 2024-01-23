import simpleGit from 'simple-git';
import * as fs from 'fs';

import {
  getCheckoutBaseDirectory,
  processGitSource,
  remoteSourceToLocalDirectory,
} from './remoteSources';

const simpleGitMock = {
  checkout: jest.fn(),
  clean: jest.fn(),
  clone: jest.fn(),
  fetch: jest.fn(),
  pull: jest.fn(),
};

jest.mock('fs');
jest.mock('simple-git', () => jest.fn(() => simpleGitMock));


describe('remoteSources', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be able to locate github sources', () => {
    const baseDir = getCheckoutBaseDirectory();

    expect(remoteSourceToLocalDirectory({
      github: 'alleyinteractive/scaffolder-features',
    })).toEqual(`${baseDir}/github/alleyinteractive/scaffolder-features`);

    expect(remoteSourceToLocalDirectory({
      github: 'alleyinteractive/scaffolder-features#master',
    })).toEqual(`${baseDir}/github/alleyinteractive/scaffolder-features`);

    expect(remoteSourceToLocalDirectory({
      github: 'https://github.com/example-org/example-repo0_1',
    })).toEqual(`${baseDir}/github/example-org/example-repo0-1`);

    expect(remoteSourceToLocalDirectory({
      github: 'https://github.com/example-org/example-repo0_1.git',
    })).toEqual(`${baseDir}/github/example-org/example-repo0-1`);

    expect(() => remoteSourceToLocalDirectory({
      github: 'invalid url',
    })).toThrow('Invalid GitHub URL: invalid url');

    expect(() => remoteSourceToLocalDirectory({
      github: 'https://github.com/example-org',
    })).toThrow('Invalid GitHub URL: https://github.com/example-org');
  });

  it('should be able to locate git sources', () => {
    expect(remoteSourceToLocalDirectory({
      git: 'git@github.com:alleyinteractive/example.git',
    })).toEqual(`${getCheckoutBaseDirectory()}/git/github-com/alleyinteractive/example-git`);

    expect(remoteSourceToLocalDirectory({
      git: 'https://bitbucket.com/alleyinteractive/other-example.git',
    })).toEqual(`${getCheckoutBaseDirectory()}/git/bitbucket-com/alleyinteractive/other-example-git`);

    expect(remoteSourceToLocalDirectory({
      git: 'https://bitbucket.com/alleyinteractive/other-example.git#master',
    })).toEqual(`${getCheckoutBaseDirectory()}/git/bitbucket-com/alleyinteractive/other-example-git`);

    expect(() => remoteSourceToLocalDirectory({
      git: 'invalid url',
    })).toThrow('Invalid Git URL: invalid url');
  });

  it('should be able to checkout a new git repository', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    simpleGitMock.clone.mockResolvedValue('');

    await processGitSource({
      git: 'https://github.com/alleyinteractive/example-generators.git',
    });

    // Only check the baseDir object property. the rest is tested in the simple-git package.
    expect(simpleGit).toHaveBeenCalledWith(
      expect.objectContaining({
        baseDir: `${getCheckoutBaseDirectory()}/git/github-com/alleyinteractive/example-generators-git`,
      }),
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

    expect(simpleGit).not.toHaveBeenCalled();
    expect(simpleGitMock.fetch).not.toHaveBeenCalled();
  });

  it('should be able to checkout a github repository', async () => {

  });
});
