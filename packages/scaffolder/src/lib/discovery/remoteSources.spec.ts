import simpleGit from 'simple-git';
import { getCheckoutBaseDirectory, remoteSourceToLocalDirectory } from './remoteSources';

describe('remoteSources', () => {
  it('should be able to locate github sources', () => {
    const baseDir = getCheckoutBaseDirectory();

    expect(remoteSourceToLocalDirectory({
      github: 'alleyinteractive/scaffolder-features',
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

    expect(() => remoteSourceToLocalDirectory({
      git: 'invalid url',
    })).toThrow('Invalid Git URL: invalid url');
  });
});
