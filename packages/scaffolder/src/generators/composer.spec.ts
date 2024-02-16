import { spawn } from 'node:child_process';
import { ComposerGenerator } from './composer';
import { silenceLogger } from '../logger';

jest.mock('node:child_process', () => ({
  spawn: jest.fn(() => ({
    on: (event: string, callback: (code: number) => void) => callback(0),
  })),
}));

describe('generators/composer', () => {
  beforeEach(() => silenceLogger());

  it('should be able to generate a composer feature', async () => {
    const generator = new ComposerGenerator({
      name: 'test',
      type: 'composer',
      composer: {
        args: '--no-dev',
        package: 'test/test',
        destination: 'test',
        version: '^1.0.0',
      },
    }, process.cwd());

    await generator.invoke();

    expect(spawn).toHaveBeenCalledWith(
      `composer create-project test/test ${process.cwd()}/test ^1.0.0 --no-dev`,
      [],
      {
        cwd: process.cwd(),
        shell: true,
        stdio: 'inherit',
      },
    );
  });
});
