import path from 'node:path';
import os from 'node:os';
import { Generator } from './generator';
import { logger } from '../logger';
import { loadFeatureHooks } from '../features/extensions';
import type { FeatureConfig } from '../types';

jest.mock('../features/extensions', () => {
  const actual = jest.requireActual('../features/extensions');

  return {
    ...actual,
    loadFeatureHooks: jest.fn(),
  };
});

class TestGenerator extends Generator {
  public events: string[] = [];

  public invokedInputs: Record<string, unknown> = {};

  public shouldThrowWhenInvoked = false;

  public configuredFiles(): FeatureConfig['files'] {
    return this.config.files;
  }

  public async collectInputs(): Promise<void> {
    this.inputs = { existing: 'input' };
  }

  public async invoke(): Promise<void> {
    this.events.push('generate');
    this.invokedInputs = this.inputs;

    if (this.shouldThrowWhenInvoked) {
      throw new Error('generation failed');
    }
  }
}

const featureDirectory = path.join(os.tmpdir(), 'scaffolder-feature');
const hookModule = './hooks/lifecycle.cjs';
const loadFeatureHooksMock = loadFeatureHooks as jest.MockedFunction<typeof loadFeatureHooks>;

const createConfig = (hooks?: string): FeatureConfig => ({
  name: 'hooked-feature',
  type: 'file',
  files: [],
  ...(hooks ? { hooks } : {}),
});

describe('generators/generator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides the extension runtime context', () => {
    const runtimeFeatureDirectory = path.join(os.tmpdir(), 'scaffolder-feature');
    const config: FeatureConfig = {
      name: 'post-type',
      description: 'Creates a post type.',
      type: 'file',
      config: { 'destination-resolver': 'relative' },
    };
    const generator = new TestGenerator(config, runtimeFeatureDirectory);
    generator.inputs = { plural: 'Posts' };
    generator.dryRun = true;

    const context = generator.collectContextVariables();

    expect(context.feature.description).toBe('Creates a post type.');
    expect(context.dryRun).toBe(true);
    expect(context.featureDirectory).toBe(runtimeFeatureDirectory);
    expect(context.resolveDestination('src/post-types.ts')).toBe(path.resolve(runtimeFeatureDirectory, 'src/post-types.ts'));
    expect(context.logger).toBe(logger());
  });

  it('runs YAML lifecycle hooks around generation in order', async () => {
    const generator = new TestGenerator(createConfig(hookModule), featureDirectory);

    loadFeatureHooksMock.mockResolvedValue({
      beforeGenerate: () => { generator.events.push('before'); },
      afterGenerate: () => { generator.events.push('after'); },
    });

    await generator.resolveAndInvoke(false);

    expect(generator.events).toEqual(['before', 'generate', 'after']);
  });

  it('uses inputs added by beforeGenerate during generation', async () => {
    const generator = new TestGenerator(createConfig(hookModule), featureDirectory);

    loadFeatureHooksMock.mockResolvedValue({
      beforeGenerate: (context) => {
        context.inputs = { added: 'from-hook' };
      },
    });

    await generator.resolveAndInvoke(false);

    expect(generator.invokedInputs).toEqual({ added: 'from-hook' });
  });

  it('passes the same input object to both lifecycle hooks', async () => {
    const generator = new TestGenerator(createConfig(hookModule), featureDirectory);
    let beforeInputs: Record<string, unknown> | undefined;
    let afterInputs: Record<string, unknown> | undefined;

    loadFeatureHooksMock.mockResolvedValue({
      beforeGenerate: (context) => {
        context.inputs = { added: 'from-hook' };
        beforeInputs = context.inputs;
      },
      afterGenerate: (context) => {
        afterInputs = context.inputs;
      },
    });

    await generator.resolveAndInvoke(false);

    expect(afterInputs).toBe(beforeInputs);
  });

  it('stops before generation when beforeGenerate throws', async () => {
    const generator = new TestGenerator(createConfig(hookModule), featureDirectory);
    const beforeError = new Error('before failed');

    loadFeatureHooksMock.mockResolvedValue({
      beforeGenerate: () => {
        generator.events.push('before');
        throw beforeError;
      },
      afterGenerate: () => { generator.events.push('after'); },
    });

    let error: Error | undefined;

    try {
      await generator.resolveAndInvoke(false);
    } catch (caught) {
      error = caught as Error;
    }

    expect(error).toEqual(expect.objectContaining({
      cause: beforeError,
      message:
      `Error running "beforeGenerate" lifecycle hook for feature "hooked-feature" from "./hooks/lifecycle.cjs" resolved to "${path.resolve(featureDirectory, hookModule)}".`,
    }));

    expect(generator.events).toEqual(['before']);
  });

  it('does not run afterGenerate when generation throws', async () => {
    const generator = new TestGenerator(createConfig(hookModule), featureDirectory);
    generator.shouldThrowWhenInvoked = true;

    loadFeatureHooksMock.mockResolvedValue({
      beforeGenerate: () => { generator.events.push('before'); },
      afterGenerate: () => { generator.events.push('after'); },
    });

    await expect(generator.resolveAndInvoke(false)).rejects.toThrow('generation failed');

    expect(generator.events).toEqual(['before', 'generate']);
  });

  it('wraps afterGenerate failures with the feature, module, stage, and cause', async () => {
    const generator = new TestGenerator(createConfig(hookModule), featureDirectory);
    const afterError = new Error('after failed');

    loadFeatureHooksMock.mockResolvedValue({
      beforeGenerate: () => { generator.events.push('before'); },
      afterGenerate: () => {
        generator.events.push('after');
        throw afterError;
      },
    });

    let error: Error | undefined;

    try {
      await generator.resolveAndInvoke(false);
    } catch (caught) {
      error = caught as Error;
    }

    expect(error).toEqual(expect.objectContaining({
      cause: afterError,
      message:
        `Error running "afterGenerate" lifecycle hook for feature "hooked-feature" from "./hooks/lifecycle.cjs" resolved to "${path.resolve(featureDirectory, hookModule)}".`,
    }));
    expect(generator.events).toEqual(['before', 'generate', 'after']);
  });

  it('passes dryRun to both lifecycle hooks', async () => {
    const generator = new TestGenerator(createConfig(hookModule), featureDirectory);
    const dryRuns: boolean[] = [];

    loadFeatureHooksMock.mockResolvedValue({
      beforeGenerate: (context) => { dryRuns.push(context.dryRun); },
      afterGenerate: (context) => { dryRuns.push(context.dryRun); },
    });

    await generator.resolveAndInvoke(true);

    expect(dryRuns).toEqual([true, true]);
  });

  it('runs YAML generation without loading hooks when none are configured', async () => {
    const generator = new TestGenerator(createConfig(), featureDirectory);
    loadFeatureHooksMock.mockRejectedValue(new Error('hooks should not load'));

    await generator.resolveAndInvoke(false);

    expect(generator.events).toEqual(['generate']);
    expect(generator.invokedInputs).toEqual({ existing: 'input' });
  });
});
