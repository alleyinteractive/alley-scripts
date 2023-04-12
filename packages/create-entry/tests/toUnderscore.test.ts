import { describe, expect, test } from '@jest/globals';
 // @ts-ignore
import { toSnakeCase } from '../src/formatting.ts';

describe('toSnakeCase', () => {
  test('replaces hyphens with underscores', () => {
    const input = 'hello-world';
    const expectedOutput = 'hello_world';
    expect(toSnakeCase(input)).toEqual(expectedOutput);
  });

  test('converts all characters to lowercase', () => {
    const input = 'HeLLo-WoRLD';
    const expectedOutput = 'hello_world';
    expect(toSnakeCase(input)).toEqual(expectedOutput);
  });

  test('handles empty input', () => {
    const input = '';
    const expectedOutput = '';
    expect(toSnakeCase(input)).toEqual(expectedOutput);
  });
});
