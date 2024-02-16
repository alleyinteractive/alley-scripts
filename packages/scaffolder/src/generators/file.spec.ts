import fs from 'node:fs';
import path from 'node:path';
import { prompt } from 'prompts';

import { FileGenerator } from './file';
import { parseYamlFile } from '../yaml';
import type { FeatureConfig } from '../types';
import { silenceLogger } from '../logger';

jest.mock('node:fs', () => {
  const actual = jest.requireActual('node:fs');

  return {
    ...actual,
    mkdirSync: jest.fn(),
    writeFileSync: jest.fn(),
  };
});

const fixturesPath = path.resolve(__dirname, '../../__tests__/fixtures');

describe('generators/file', () => {
  const directory = `${fixturesPath}/a-features/feature-a`;
  const config = parseYamlFile(`${directory}/config.yml`) as FeatureConfig;

  beforeEach(() => {
    jest.clearAllMocks();

    silenceLogger();
  });

  it('should be able to generate a set of files', async () => {
    const generator = new FileGenerator(config, directory);

    // By default the destination resolver is process.cwd().
    expect(generator.getDestinationDirectory('src/test-feature-a/example.php')).toBe(`${process.cwd()}/src/test-feature-a/example.php`);

    // Inject the inputs that will be used to resolve the destination.
    prompt.inject(['Feature Name']);

    await generator.resolveAndInvoke(false);

    // Check that the directory was created.
    expect(fs.mkdirSync).toHaveBeenCalledWith(`${process.cwd()}/src/test-feature-a`, { recursive: true });

    // Check that the file was written.
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      `${process.cwd()}/src/test-feature-a/class-feature-name.php`, // Calculated from the above prompt.
      expect.any(String),
    );
  });

  it('should not generate anything in a dry run', async () => {
    const generator = new FileGenerator(config, directory);

    // Inject the inputs that will be used to resolve the destination.
    prompt.inject(['Feature Name']);

    await generator.resolveAndInvoke(true);

    // Check that the directory was not created.
    expect(fs.mkdirSync).not.toHaveBeenCalled();

    // Check that the file was not written.
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });
});
