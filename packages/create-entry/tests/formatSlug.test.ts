import formatSlug from '../src/formatSlug';

describe('formatSlug', () => {
  test('should format string to lowercase with hyphens', () => {
    const result = formatSlug('Hello World_Test');
    expect(result).toBe('hello-world-test');
  });

  test('should handle empty string', () => {
    const result = formatSlug('');
    expect(result).toBe('');
  });

  test('should handle string with spaces or underscores', () => {
    const result1 = formatSlug('   hello   ');
    expect(result1).toBe('---hello---');

    const result2 = formatSlug('___goodbye___');
    expect(result2).toBe('---goodbye---');
  });
});
