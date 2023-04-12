import { describe, expect, test } from '@jest/globals';
 // @ts-ignore
import { validateSlug } from '../src/validation.ts';

describe('validateSlug', () => {
  test('should return true for a valid slug', () => {
    const slug = 'my-valid-slug';
    expect(validateSlug(slug)).toBe(true);
  });

  test('should return false for an invalid slug', () => {
    const slug = 'my invalid_slug';
    expect(validateSlug(slug)).toBe(false);
  });
});
