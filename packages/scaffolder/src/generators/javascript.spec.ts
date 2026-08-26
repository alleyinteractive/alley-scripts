import os from 'node:os';
import path from 'node:path';
import { prompt } from 'prompts';

import { JavaScriptGenerator } from './javascript';
import type { ScaffolderContext } from '../types';

const featureDirectory = path.join(os.tmpdir(), 'extensions', 'post-type');

describe('generators/javascript', () => {
  it('collects custom prompt answers before generation', async () => {
    prompt.inject(['book']);
    const generate = jest.fn();
    const prompts = jest.fn(() => [{ name: 'slug', type: 'text', message: 'Slug' }]);
    const generator = new JavaScriptGenerator({
      type: 'javascript',
      name: 'post-type',
      description: 'Creates a post type.',
      prompts,
      generate,
    }, featureDirectory);

    await generator.resolveAndInvoke(false);

    expect(prompts).toHaveBeenCalledWith(expect.objectContaining({
      dryRun: false,
      feature: {
        name: 'post-type',
        description: 'Creates a post type.',
      },
      inputs: {},
    }));
    expect(generate).toHaveBeenCalledWith(expect.objectContaining({
      inputs: { slug: 'book' },
    }));
  });

  it('supplies a complete context when prompts are omitted', async () => {
    let receivedContext: ScaffolderContext | undefined;
    const generator = new JavaScriptGenerator({
      type: 'javascript',
      name: 'post-type',
      description: 'Creates a post type.',
      generate: async (context: ScaffolderContext) => {
        receivedContext = context;
      },
    }, featureDirectory);

    await generator.resolveAndInvoke(true);

    expect(receivedContext).toEqual(expect.objectContaining({
      cwd: process.cwd(),
      dryRun: true,
      feature: {
        name: 'post-type',
        description: 'Creates a post type.',
      },
      featureDirectory,
      inputs: {},
      logger: expect.anything(),
      resolveDestination: expect.any(Function),
    }));
    expect(receivedContext?.resolveDestination('generated/post-type.ts')).toBe(
      path.resolve(process.cwd(), 'generated/post-type.ts'),
    );
  });

  it('adds feature and stage details when prompts fail', async () => {
    const cause = new Error('Prompt failed.');
    const generator = new JavaScriptGenerator({
      type: 'javascript',
      name: 'post-type',
      prompts: () => {
        throw cause;
      },
      generate: async () => {},
    }, featureDirectory);

    let error: Error | undefined;

    try {
      await generator.resolveAndInvoke(false);
    } catch (caughtError) {
      error = caughtError as Error;
    }

    expect(error).toMatchObject({
      cause,
      message: expect.stringContaining('collecting inputs'),
    });
    expect(error?.message).toContain('post-type');
  });

  it('adds feature and stage details when generation fails', async () => {
    const cause = new Error('Generation failed.');
    const generator = new JavaScriptGenerator({
      type: 'javascript',
      name: 'post-type',
      generate: async () => {
        throw cause;
      },
    }, featureDirectory);

    let error: Error | undefined;

    try {
      await generator.resolveAndInvoke(false);
    } catch (caughtError) {
      error = caughtError as Error;
    }

    expect(error).toMatchObject({
      cause,
      message: expect.stringContaining('generating'),
    });
    expect(error?.message).toContain('post-type');
  });

  it('passes direct prompt answers to generation without prompting', async () => {
    prompt.inject([new Error('The prompts library should not be invoked.')]);
    const generate = jest.fn();
    const generator = new JavaScriptGenerator({
      type: 'javascript',
      name: 'post-type',
      prompts: () => ({ slug: 'movie' }),
      generate,
    }, featureDirectory);

    await generator.resolveAndInvoke(false);

    expect(generate).toHaveBeenCalledWith(expect.objectContaining({
      inputs: { slug: 'movie' },
    }));
  });
});
