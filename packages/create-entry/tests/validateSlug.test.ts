import { describe, expect, test } from '@jest/globals';
import validateSlug from '../src/validateSlug';

describe('validateSlug', () => {
  test('should return true for a valid slug', () => {
    const slug = 'my-valid-slug';
    expect(validateSlug(slug)).toBe(true);
  });

  test('should return an error message for an invalid slug', () => {
    const slug = 'my invalid_slug';
    expect(validateSlug(slug)).toBe('Please enter a valid slug (lowercase, no spaces, only hyphens)');
  });
});
