import prompts from 'prompts';

import {
  definitionsFromFeatureInputs,
  definitionsFromPrompts,
  parseInputArguments,
  resolveInputs,
} from './inputs';
import type { FeatureInput } from './types';

const featureInputs: FeatureInput[] = [
  { name: 'slug', type: 'string', description: 'Slug' },
  { name: 'label', type: 'string', default: 'Label' },
  { name: 'optional', type: 'string', required: false },
  { name: 'tests', type: 'boolean', default: true },
];

describe('parseInputArguments', () => {
  it('parses repeated key=value pairs', () => {
    expect(parseInputArguments(['slug=book', 'label=A=B'])).toEqual({ slug: 'book', label: 'A=B' });
  });

  it('parses a JSON object and lets --input override it', () => {
    expect(parseInputArguments(['slug=movie'], '{"slug":"book","tests":false,"count":2}'))
      .toEqual({ slug: 'movie', tests: false, count: '2' });
  });

  it('rejects malformed values', () => {
    expect(() => parseInputArguments(['slug'])).toThrow('Use --input key=value');
    expect(() => parseInputArguments([], '[1]')).toThrow('must be a JSON object');
    expect(() => parseInputArguments([], '{')).toThrow('must be a JSON object');
  });
});

describe('resolveInputs', () => {
  const definitions = definitionsFromFeatureInputs(featureInputs);

  it('uses provided values and defaults without prompting in non-interactive mode', async () => {
    await expect(resolveInputs(definitions, {
      provided: { slug: 'book', tests: 'no' },
      interactive: false,
    })).resolves.toEqual({
      slug: 'book',
      label: 'Label',
      optional: '',
      tests: false,
    });
  });

  it('lists missing required inputs in non-interactive mode', async () => {
    await expect(resolveInputs(definitions, { interactive: false, featureName: 'example' }))
      .rejects.toThrow(/Missing required input\(s\) for "example":\n {2}- slug \(string\): Slug[\s\S]*--input slug=<slug>/);
  });

  it('rejects unknown inputs and invalid booleans', async () => {
    await expect(resolveInputs(definitions, { provided: { nope: 'x' }, interactive: false }))
      .rejects.toThrow('Unknown input(s) for "feature": nope. Valid inputs: slug, label, optional, tests.');
    await expect(resolveInputs(definitions, { provided: { slug: 'a', tests: 'maybe' }, interactive: false }))
      .rejects.toThrow('must be a boolean');
  });

  it('prompts only for inputs that were not provided when interactive', async () => {
    prompts.inject(['Book', 'extra', true]);

    await expect(resolveInputs(definitions, { provided: { slug: 'book' } })).resolves.toEqual({
      slug: 'book',
      label: 'Book',
      optional: 'extra',
      tests: true,
    });
  });
});

describe('definitionsFromPrompts', () => {
  it('maps JavaScript feature prompts to input definitions', () => {
    expect(definitionsFromPrompts([
      {
        type: 'confirm', name: 'confirm', message: 'Continue?', initial: true,
      },
      { type: 'text', name: 'title', message: 'Title' },
      {
        type: 'select',
        name: 'color',
        message: 'Color',
        initial: 1,
        choices: [{ title: 'Red', value: 'red' }, { title: 'Blue', value: 'blue' }],
      },
    ]).map(({ question, ...definition }) => definition)).toEqual([
      {
        name: 'confirm', type: 'boolean', required: false, default: true, description: 'Continue?',
      },
      {
        name: 'title', type: 'string', required: true, default: undefined, description: 'Title',
      },
      {
        name: 'color', type: 'string', required: false, default: 'blue', description: 'Color',
      },
    ]);
  });
});
